
import * as SecureStore from 'expo-secure-store';
import { AESEncryptionKey } from 'expo-crypto';

const MASTER_KEY_STORAGE = 'keep.master-key.v1';

/**
 * Creates and securely stores the master key on first setup.
 * On later calls, retrieves the existing key.
 */
export async function getOrCreateMasterKey(): Promise<AESEncryptionKey> {
  const available = await SecureStore.isAvailableAsync();

  if (!available) {
    throw new Error('Secure storage is unavailable on this device.');
  }

  const storedKey = await SecureStore.getItemAsync(MASTER_KEY_STORAGE);

  if (storedKey) {
    return AESEncryptionKey.import(storedKey, 'hex');
  }

  const key = await AESEncryptionKey.generate(256);
  const encodedKey = await key.encoded('hex');

  await SecureStore.setItemAsync(MASTER_KEY_STORAGE, encodedKey);

  return key;
}
