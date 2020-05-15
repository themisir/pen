import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [
  T,
  (newValue: T | ((current: T) => T), commit?: boolean) => void,
  () => void
] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);

  const saveValue = (
    newValue: T | ((current: T) => T),
    commit: boolean = false
  ) => {
    if (commit) {
      if (typeof value === "function") {
        setValue((current) => {
          const val = value(current);
          localStorage.setItem(key, JSON.stringify(value));
          return val;
        });
      } else {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } else {
      setValue(newValue);
    }
  };

  const commit = () => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, saveValue, commit];
}
