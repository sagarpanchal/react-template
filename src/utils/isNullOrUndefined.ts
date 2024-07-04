export function isNullOrUndefined(input: any): input is null | undefined {
  return input === null || input === undefined
}
