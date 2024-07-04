export function isDate(input: unknown): input is Date {
  return input instanceof Date && !Number.isNaN(input)
}
