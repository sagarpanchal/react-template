export function isEmptyObject(input: Record<string | number | symbol, unknown>): boolean {
  return Object.keys(input).length === 0
}
