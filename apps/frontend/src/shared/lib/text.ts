function listWithConjunction(items: string[], conjunction: string) {
  return items.length === 0
    ? ""
    : items.length === 1
      ? items.at(0)!
      : [items.slice(0, -1).join(", "), conjunction, items.at(-1)].join(" ");
}

export { listWithConjunction };
