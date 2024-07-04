import { isString } from "./isString"

export function cx(...list: any[]): string {
  return list.flat().filter(isString).join(" ")
}
