export function isObject(input: any): input is Record<string | number | symbol, unknown> {
  return input?.constructor === Object
}
