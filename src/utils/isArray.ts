export function isArray(input: any): input is unknown[] {
  return Array.isArray(input)
}
