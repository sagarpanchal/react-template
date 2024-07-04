import { describe, expect, it } from "vitest"

import { isNumber } from "./isNumber"

describe("isNumber", () => {
  it("should return true for numbers", () => {
    expect(isNumber(1)).toBe(true)
  })

  it("should return false for NaN", () => {
    expect(isNumber(NaN)).toBe(false)
  })

  it("should return false for Infinity", () => {
    expect(isNumber(Infinity)).toBe(false)
  })
})
