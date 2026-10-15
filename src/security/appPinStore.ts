
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const APP_PIN_HASH_KEY = 'keep.app-pin.hash.v1';
const APP_PIN_SALT_KEY = 'keep.app-pin.salt.v1';

export async function hasAppPin(): Promise<boolean> {
  const hash = await SecureStore.getItemAsync(APP_PIN_HASH_KEY);
  return hash !== null;
}

export async function setAppPin(pin: string): Promise<void> {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('App PIN must contain exactly 6 digits.');
  }

  const available = await SecureStore.isAvailableAsync();

  if (!available) {
    throw new Error('Secure storage is unavailable on this device.');
  }

  const saltBytes = await Crypto.getRandomBytesAsync(16);
  const salt = Array.from(saltBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`
  );

  await SecureStore.setItemAsync(APP_PIN_SALT_KEY, salt);
  await SecureStore.setItemAsync(APP_PIN_HASH_KEY, hash);
}

export async function verifyAppPin(pin: string): Promise<boolean> {
  if (!/^\d{6}$/.test(pin)) {
    return false;
  }

  const [salt, storedHash] = await Promise.all([
    SecureStore.getItemAsync(APP_PIN_SALT_KEY),
    SecureStore.getItemAsync(APP_PIN_HASH_KEY),
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
