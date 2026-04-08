import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const AppStorage = {
  /**
   * Get a value from storage
   * @param key The key to retrieve
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        console.error('LocalStorage error:', err);
        return null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },

  /**
   * Set a value in storage
   * @param key The key to set
   * @param value The string value to store
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error('LocalStorage error:', err);
      }
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },

  /**
   * Remove a value from storage
   * @param key The key to delete
   */
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error('LocalStorage error:', err);
      }
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  }
};

export default AppStorage;