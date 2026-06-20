import { useState, useEffect } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      
    }
  }, [key, storedValue]);

  const setValue: SetValue<T> = (value) => {
    setStoredValue((prev) =>
      typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
    );
  };

  return [storedValue, setValue];
}


export function UseLocalStorageHook() {
  return null;
}

export default useLocalStorage;