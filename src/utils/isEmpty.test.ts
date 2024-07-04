import { describe, expect, it } from "vitest"

import { isEmpty } from "./isEmpty"

describe("isEmpty", () => {
  it("should return true for empty values", () => {
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty("")).toBe(true)
    expect(isEmpty(NaN)).toBe(true)
    expect(isEmpty(Infinity)).toBe(true)
  })

  it("should return false for non-empty values", () => {
    expect(isEmpty([1, 2, 3])).toBe(false)
    expect(isEmpty({ a: 1, b: 2, c: 3 })).toBe(false)
    expect(isEmpty(new Set([1, 2, 3]))).toBe(false)
    expect(isEmpty(new Map([["a", 1], ["b", 2], ["c", 3]]))).toBe(false) // prettier-ignore
    expect(isEmpty("123")).toBe(false)
    expect(isEmpty(0)).toBe(false)
  })

  it("should return false for unhandled types", () => {
    expect(isEmpty(() => {})).toBe(false)
  })

  it("should return true for options.isEmpty", () => {
    expect(isEmpty("test", { isEmpty: ["test"] })).toBe(true)
  })

  it("should return false for options.isNotEmpty", () => {
    expect(isEmpty("test", { isNotEmpty: ["test"] })).toBe(false)
  })
})
