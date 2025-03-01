import { useEffect, useState } from "react";

import { getItem, setItem } from "./local-storage";

function usePersistedState<S>(key: string, defaultValue: S) {
  const [value, setValue] = useState<S>(() => {
    return getItem<S>(key) ?? defaultValue;
  });

  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export { usePersistedState };
