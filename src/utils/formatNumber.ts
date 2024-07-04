import { castToNumber } from "./castToNumber"
import { isNumber } from "./isNumber"

import { LOCALE } from "../constants"

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string
  fractionLength?: number
}

export function formatNumber(input: unknown, options: FormatNumberOptions | number = {}) {
  const number = castToNumber(input)
  if (!isNumber(number)) return ""

  options = (isNumber(options) ? { fractionLength: options } : options) as FormatNumberOptions
  options.fractionLength = (() => {
    /* v8 ignore next 1 */
    const length = options.fractionLength ?? `${number}`.split(".")?.[1]?.length ?? undefined

    if (!isNumber(options.fractionLength) && isNumber(length)) {
      if (isNumber(options.maximumFractionDigits) && length > options.maximumFractionDigits) {
        return options.maximumFractionDigits
      }

      if (isNumber(options.minimumFractionDigits) && length < options.minimumFractionDigits) {
        return options.minimumFractionDigits
      }
    }

    return length
  })()
  options.locale = options.locale ?? LOCALE

  const { locale, fractionLength, ...restOptions } = options

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: fractionLength,
    minimumFractionDigits: fractionLength,
    ...restOptions,
  }).format(number)
}
