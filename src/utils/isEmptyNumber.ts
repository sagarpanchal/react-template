export function isEmptyNumber(input: number): boolean {
  return Number.isNaN(input) || !Number.isFinite(input)
}
