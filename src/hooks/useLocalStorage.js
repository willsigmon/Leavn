import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state that persists in localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no stored value exists
 * @returns {[any, Function]} - State value and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Get stored value or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
