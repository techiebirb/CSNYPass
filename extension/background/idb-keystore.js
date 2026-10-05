/**
 * Holds the Full-auto data key as a non-extractable CryptoKey in IndexedDB, kept
 * apart from the ciphertext in storage.local. Non-extractable means the key bytes
 * can't be read back out through any API, only used to encrypt/decrypt.
 */
const DB_NAME = "csnyExtension.keystore";
const STORE = "keys";
const DEK_ID = "dek";
/** Encrypts the biometric-mode public profile (email etc.); never holds the password. */
const PROFILE_KEY_ID = "profileKey";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, run) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = run(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(request?.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export function idbGetDek() {
  return withStore("readonly", (s) => s.get(DEK_ID));
}

export function idbPutDek(key) {
  return withStore("readwrite", (s) => s.put(key, DEK_ID));
}

export function idbDeleteDek() {
  return withStore("readwrite", (s) => s.delete(DEK_ID));
}

export function idbGetProfileKey() {
  return withStore("readonly", (s) => s.get(PROFILE_KEY_ID));
}

export function idbPutProfileKey(key) {
  return withStore("readwrite", (s) => s.put(key, PROFILE_KEY_ID));
}

export function idbDeleteProfileKey() {
  return withStore("readwrite", (s) => s.delete(PROFILE_KEY_ID));
}
