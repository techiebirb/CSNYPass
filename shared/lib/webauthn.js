/**
 * Touch ID / Face ID / Windows Hello via WebAuthn + the PRF extension.
 * Must run in an extension page (popup/options/unlock window), never a content script:
 * the passkey is bound to the extension's own origin.
 *
 * The PRF output is the secret that unwraps the data key, so nothing needs to be
 * "verified" afterwards: a wrong or missing biometric simply can't decrypt.
 */
import { base64ToBytes, bytesToBase64, toUint8Array } from "./bytes.js";

const RP_NAME = "CSNYPass";
const TIMEOUT_MS = 60_000;

export class BiometricError extends Error {
  /** @param {"unsupported" | "prf-unsupported" | "cancelled" | "failed"} code */
  constructor(code, message) {
    super(message);
    this.name = "BiometricError";
    this.code = code;
  }
}

export async function isBiometricSupported() {
  try {
    if (!globalThis.PublicKeyCredential || !navigator.credentials) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

function mapError(err) {
  if (err instanceof BiometricError) return err;
  if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
    return new BiometricError("cancelled", "Biometric prompt was cancelled or timed out.");
  }
  if (err?.name === "NotSupportedError" || err?.name === "SecurityError") {
    return new BiometricError(
      "unsupported",
      "This browser or device could not use Touch ID / Face ID here."
    );
  }
  return new BiometricError("failed", err?.message || "Biometric check failed.");
}

function prfFirst(results) {
  const first = results?.prf?.results?.first;
  return first ? toUint8Array(first) : null;
}

/**
 * Evaluates the PRF for an existing credential (one biometric prompt).
 * @param {{ credentialId: string, prfSalt: string, transports?: string[] }} credential
 * @returns {Promise<string>} base64 PRF output
 */
export async function getPrfOutput(credential) {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            type: "public-key",
            id: base64ToBytes(credential.credentialId),
            ...(credential.transports?.length ? { transports: credential.transports } : {}),
          },
        ],
        userVerification: "required",
        timeout: TIMEOUT_MS,
        extensions: { prf: { eval: { first: base64ToBytes(credential.prfSalt) } } },
      },
    });
    const out = prfFirst(assertion.getClientExtensionResults());
    if (!out) {
      throw new BiometricError(
        "prf-unsupported",
        "This device did not return a biometric key (PRF unsupported)."
      );
    }
    return bytesToBase64(out);
  } catch (err) {
    throw mapError(err);
  }
}

/**
 * Registers a platform credential and derives its PRF output.
 * Requires a user gesture. May prompt twice if the authenticator can't evaluate PRF
 * during registration.
 * @returns {Promise<{ credentialId: string, prfSalt: string, prfOutput: string, transports: string[] }>}
 */
export async function createBiometricCredential() {
  if (!(await isBiometricSupported())) {
    throw new BiometricError(
      "unsupported",
      "Touch ID / Face ID is not available on this device or browser."
    );
  }

  const prfSalt = crypto.getRandomValues(new Uint8Array(32));
  let credential;
  try {
    credential = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: RP_NAME },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: "collegiate-auto-sign-in",
          displayName: RP_NAME,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "discouraged",
        },
        attestation: "none",
        timeout: TIMEOUT_MS,
        extensions: { prf: { eval: { first: prfSalt } } },
      },
    });
  } catch (err) {
    throw mapError(err);
  }

  const results = credential.getClientExtensionResults();
  if (!results?.prf?.enabled && !results?.prf?.results) {
    throw new BiometricError(
      "prf-unsupported",
      "This browser or device can't use Touch ID / Face ID to protect saved data. Use Full auto instead."
    );
  }

  const transports =
    typeof credential.response?.getTransports === "function"
      ? credential.response.getTransports()
      : [];
  const info = {
    credentialId: bytesToBase64(toUint8Array(credential.rawId)),
    prfSalt: bytesToBase64(prfSalt),
    transports,
  };

  const immediate = prfFirst(results);
  const prfOutput = immediate
    ? bytesToBase64(immediate)
    : await getPrfOutput(info);
  return { ...info, prfOutput };
}
