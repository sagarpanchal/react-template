export function isNumber(input: any): input is number {
  return typeof input === "number" && isFinite(input) && !isNaN(input)
}
