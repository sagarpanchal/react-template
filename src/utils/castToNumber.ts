import { isEmpty } from "./isEmpty"
import { isNull } from "./isNull"
import { isNumber } from "./isNumber"
import { isString } from "./isString"
import { isUndefined } from "./isUndefined"

export function castToNumber<T>(input: unknown, altOutput?: T): number | (T extends number ? T : undefined)
export function castToNumber(input: unknown, altOutput: unknown): unknown {
  switch (true) {
    case isUndefined(input):
    case isNull(input): {
      return altOutput
    }

    case isString(input): {
      const numeric = /^[+-]?[\d]+(?:\.[\d]*)?(?:[eE][+-]?\d+)?$/gm.test(input)
        ? input
        : `${input}`.replace(/[^0-9.+-]/g, "")
      if (isEmpty(numeric)) return altOutput

      const number = Number(numeric)
      if (!isNumber(number)) return altOutput

      return number
    }

    default: {
      const number = Number(input)
      if (!isNumber(number)) return altOutput

      return number
    }
  }
}
