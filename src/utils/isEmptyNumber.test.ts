import { describe, expect, it } from "vitest"

import { isEmptyNumber } from "./isEmptyNumber"

describe("isEmptyNumber", () => {
  it("should return true for NaN", () => {
    expect(isEmptyNumber(NaN)).toBe(true)
  })

  it("should return true for Infinity", () => {
    expect(isEmptyNumber(Infinity)).toBe(true)
  })

  it("should return true for -Infinity", () => {
    expect(isEmptyNumber(-Infinity)).toBe(true)
  })

  it("should return false for 0", () => {
    expect(isEmptyNumber(0)).toBe(false)
  })

  it("should return false for 1", () => {
    expect(isEmptyNumber(1)).toBe(false)
  })

  it("should return false for -1", () => {
    expect(isEmptyNumber(-1)).toBe(false)
  })
})
