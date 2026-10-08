/** Byte/base64 helpers shared by background, popup, and tests. */

export function bytesToBase64(bytes) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function toUint8Array(bufferOrView) {
  if (bufferOrView instanceof Uint8Array) return bufferOrView;
  if (ArrayBuffer.isView(bufferOrView)) {
    return new Uint8Array(
      bufferOrView.buffer,
      bufferOrView.byteOffset,
      bufferOrView.byteLength
    );
  }
  return new Uint8Array(bufferOrView);
}
