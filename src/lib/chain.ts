// A page in a looping chain (the studies, the tools): the item for a slug and the one after it,
// the last running back to the first (0210; each loader did this itself).
export function withNext<T extends { slug: string }>(list: readonly T[], slug: string): { item: T; next: T } | null {
  const i = list.findIndex((x) => x.slug === slug);
  return i < 0 ? null : { item: list[i], next: list[(i + 1) % list.length] };
}
