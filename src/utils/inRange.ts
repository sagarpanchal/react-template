type NumberOrBigInt = number | bigint

type InRangeOptions = {
  start?: NumberOrBigInt
  end: NumberOrBigInt
}

const min = (left: NumberOrBigInt, right: NumberOrBigInt) => (left < right ? left : right)
const max = (left: NumberOrBigInt, right: NumberOrBigInt) => (left > right ? left : right)

function isNumberOrBigInt(value: any) {
  return ["number", "bigint"].includes(typeof value)
}

export function inRange(number: NumberOrBigInt, { start = 0, end }: InRangeOptions) {
  if (!isNumberOrBigInt(number) || !isNumberOrBigInt(start) || !isNumberOrBigInt(end)) {
    throw new TypeError("Expected each argument to be either a number or a BigInt")
  }

  return number >= min(start, end) && number <= max(end, start)
}
