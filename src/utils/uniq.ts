export function uniq<T = unknown>(input: T[]) {
  return [...new Set(input)]
}
