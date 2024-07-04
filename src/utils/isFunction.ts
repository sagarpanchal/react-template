// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(input: unknown): input is Function {
  return typeof input === "function"
}
