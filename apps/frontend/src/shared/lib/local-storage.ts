function getItem<T>(key: string) {
  const item = window.localStorage.getItem(key);
  return item === null ? item : (JSON.parse(item) as T);
}

function setItem<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export { getItem, setItem };
