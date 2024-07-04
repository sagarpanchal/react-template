import { describe, it, expect } from "vitest"

import { isNumeric } from "./isNumeric"

describe("isNumeric", () => {
  it("should return true for number", () => {
    expect(isNumeric(1, true)).toBe(true)
  })

  it("should return true for string number", () => {
    expect(isNumeric("-1.", false)).toBe(true)
    expect(isNumeric("1", true)).toBe(true)
  })

  it("should return false for string", () => {
    expect(isNumeric("a")).toBe(false)
  })
})
