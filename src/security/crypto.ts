
import {
  AESEncryptionKey,
  AESSealedData,
  aesEncryptAsync,
  aesDecryptAsync,
} from 'expo-crypto';

/**
 * Generates a fresh 256-bit AES encryption key.
 * This key is not yet saved or connected to any PIN.
 */
export async function generateEncryptionKey(): Promise<AESEncryptionKey> {
  return AESEncryptionKey.generate(256);
}

/**
 * Encrypts binary data using AES-GCM.
 * The returned bytes contain the nonce, ciphertext, and authentication tag.
 */
export async function encryptBytes(
  data: Uint8Array,
  key: AESEncryptionKey
): Promise<Uint8Array> {
  const sealedData = await aesEncryptAsync(data, key);
  return sealedData.combined();
}

/**
 * Decrypts data produced by encryptBytes.
 * Authentication fails if the encrypted data or key is incorrect.
 */
export async function decryptBytes(
  encryptedData: Uint8Array,
  key: AESEncryptionKey
): Promise<Uint8Array> {
  const sealedData = AESSealedData.fromCombined(encryptedData);
  const result = await aesDecryptAsync(sealedData, key, {
    output: 'bytes',
  });

  if (!(result instanceof Uint8Array)) {
    throw new Error('Unexpected decrypted data format.');
  }

  return result;
}

export async function testEncryptionRoundTrip(): Promise<boolean> {
  const original = new Uint8Array([10, 20, 30, 40, 50, 255]);

  const key = await generateEncryptionKey();
  const encrypted = await encryptBytes(original, key);
  const decrypted = await decryptBytes(encrypted, key);

  const matches =
    original.length === decrypted.length &&
    original.every((byte, index) => byte === decrypted[index]);

  if (!matches) {
    throw new Error('Encryption round-trip test failed.');
  }

  return true;
}

