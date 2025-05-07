import { useEffect, useRef, useState } from "react";

function usePreviousValue<T>(value: T) {
  const storedValue = useRef<T>(null);
  const previousValue = storedValue.current;
  storedValue.current = value;
  return previousValue;
}

function useMediaQuery(query: string) {
  const [mediaQueryList] = useState(() => window.matchMedia(query));
  const [matches, setMatches] = useState(() => mediaQueryList.matches);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    mediaQueryList.addEventListener(
      "change",
      ({ matches }) => {
        setMatches(matches);
      },
      {
        signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, [mediaQueryList]);

  return matches;
}

export { useMediaQuery, usePreviousValue };
