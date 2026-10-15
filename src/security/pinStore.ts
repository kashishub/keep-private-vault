
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const FOLDER_PIN_HASH_KEY = 'keep.folder-pin.hash.v1';
const FOLDER_PIN_SALT_KEY = 'keep.folder-pin.salt.v1';

export async function hasFolderPin(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(FOLDER_PIN_HASH_KEY);
  return hash !== null;
}

export async function setFolderPin(pin: string): Promise<void> {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Folder PIN must contain exactly 6 digits.');
  }

  const available = await SecureStore.isAvailableAsync();

  if (!available) {
    throw new Error('Secure storage is unavailable on this device.');
  }

  const salt = await Crypto.getRandomBytesAsync(16);
  const saltHex = Array.from(salt)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${saltHex}:${pin}`
  );

  await SecureStore.setItemAsync(FOLDER_PIN_SALT_KEY, saltHex);
  await SecureStore.setItemAsync(FOLDER_PIN_HASH_KEY, hash);
}

export async function verifyFolderPin(pin: string): Promise<boolean> {
  if (!/^\d{6}$/.test(pin)) {
    return false;
  }

  const [salt, storedHash] = await Promise.all([
    SecureStore.getItemAsync(FOLDER_PIN_SALT_KEY),
    SecureStore.getItemAsync(FOLDER_PIN_HASH_KEY),
  ]);

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );

  return candidateHash === storedHash;
}
