// app/services/cacheService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

class CacheService {
  static async save<T>(key: string, data: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(`Cache save error [${key}]:`, error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log(`Cache get error [${key}]:`, error);
      return null;
    }
  }

  static async remove(key: string) {
    await AsyncStorage.removeItem(key);
  }

  static async clearAll() {
    await AsyncStorage.clear();
  }
}

export default CacheService;