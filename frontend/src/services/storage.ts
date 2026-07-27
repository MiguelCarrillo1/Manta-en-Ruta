import { Platform } from 'react-native';

let SecureStore: any;
try {
  SecureStore = require('expo-secure-store');
} catch {
  SecureStore = null;
}

const memoryStore: Record<string, string> = {};

const isWeb = Platform.OS === 'web';

export const storage = {
  async getItemAsync(key: string): Promise<string | null> {
    if (isWeb || !SecureStore) {
      return localStorage?.getItem(key) ?? memoryStore[key] ?? null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return memoryStore[key] ?? null;
    }
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    if (isWeb || !SecureStore) {
      localStorage?.setItem(key, value);
      memoryStore[key] = value;
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (isWeb || !SecureStore) {
      localStorage?.removeItem(key);
      delete memoryStore[key];
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      delete memoryStore[key];
    }
  },
};
