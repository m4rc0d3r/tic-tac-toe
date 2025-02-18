function listWithConjunction(items: string[]) {
  return items.length === 0
    ? ""
    : items.length === 1
      ? items.at(0)!
      : [items.slice(0, -1).join(", "), "and", items.at(-1)].join(" ");
}

export { listWithConjunction };
