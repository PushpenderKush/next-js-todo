import { useState } from "react";

// eslint-disable-next-line no-unused-vars
type ReturnValue<T> = [T | null, (value: T) => void];

function useLocalStorage<T>(key: string, initialValue?: T): ReturnValue<T> {
  const isLocalStorageAvailable = typeof localStorage !== "undefined";

  const storedValue = isLocalStorageAvailable
    ? localStorage.getItem(key)
    : null;
  const initialData: T | null = storedValue
    ? JSON.parse(storedValue)
    : initialValue || null;

  const [value, setValue] = useState<T | null>(initialData);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    isLocalStorageAvailable &&
      localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
