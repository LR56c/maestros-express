import type {
  BaseException
} from "~~/modules/shared/domain/exceptions/base_exception"
import {
  UnknownException
} from "~~/modules/shared/domain/exceptions/unknown_exception"

export async function encryptData(publicKeyPem : string, body : Record<string, any>) : Promise<{ key: string, data: string } | BaseException> {
  try{
  function pemToArrayBuffer(pem : string) {
    // const b64 = pem
    //   .replace(/-----BEGIN PUBLIC KEY-----/, '')
    //   .replace(/-----END PUBLIC KEY-----/, '')
    //   .replace(/\s/g, '');
    const binaryString = atob(pem);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const publicKeyBuffer = pemToArrayBuffer(publicKeyPem);
  const rsaPublicKey = await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const aesKeyRaw = crypto.getRandomValues(new Uint8Array(16));

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const dataToEncrypt = new TextEncoder().encode(JSON.stringify(body));

  const iv = aesKeyRaw.slice(0, 16);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    aesKey,
    dataToEncrypt
  );

  const encryptedAesKeyBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    aesKeyRaw
  );

  function arrayBufferToBase64(buffer : ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  const encryptedData = arrayBufferToBase64(encryptedBuffer);
  const encryptedAesKey = arrayBufferToBase64(encryptedAesKeyBuffer);

  return {
    key: encryptedAesKey,
    data: encryptedData
  };
  }
  catch ( e ) {
    return new UnknownException( )
  }
}
