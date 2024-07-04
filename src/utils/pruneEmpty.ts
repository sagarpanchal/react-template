import { PartialDeep } from "type-fest"

import { catchError } from "./catchError"
import { isArray } from "./isArray"
import { isEmpty, IsEmptyOptions } from "./isEmpty"
import { isObject } from "./isObject"

interface PruneEmptyOptions extends Partial<IsEmptyOptions> {}

export function pruneEmpty<T>(input: T, options?: PruneEmptyOptions): PartialDeep<T> | undefined {
  options = { ...options }

  const prune = (current: any) => {
    current = catchError(() => {
      if (isArray(current)) {
        for (let index = current.length; index > -1; index--) {
          if (isEmpty(prune(current[index]), options)) current.splice(index, 1)
        }
      }

      if (isObject(current)) {
        for (const prop in current) {
          if (isEmpty(prune(current[prop]), options)) delete current[prop]
        }
      }

      if (!isEmpty(current, options)) return current
    })

    return current
  }

  return prune(input)
}
