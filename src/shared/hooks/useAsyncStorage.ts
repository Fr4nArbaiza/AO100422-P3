import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for AsyncStorage operations
 * @param key - Storage key
 * @param initialValue - Initial value
 * @returns [value, setValue, loading, error]
 */
export const useAsyncStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean, string | null] => {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const setStoredValue = async (newValue: T) => {
    try {
      setError(null);
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving data');
    }
  };

  return [value, setStoredValue, loading, error];
};


