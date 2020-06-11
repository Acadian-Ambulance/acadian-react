import React = require('react');

export function useLocalStorage<T>(localStorageKey: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const stored = localStorage.getItem(localStorageKey);
  const [value, setValue] = React.useState(
    stored !== null ? JSON.parse(stored) as T : initialState
  );
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
};