import { useRef } from "react";

function usePreviousValue<T>(value: T) {
  const storedValue = useRef<T>(null);
  const previousValue = storedValue.current;
  storedValue.current = value;
  return previousValue;
}

export { usePreviousValue };
