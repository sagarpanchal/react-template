import { describe, it, expect } from "vitest"

import { isDate } from "./isDate"

describe("isDate", () => {
  it("should return true if the input is a date", () => {
    const result = isDate(new Date())
    expect(result).toBe(true)
  })

  it("should return false if the input is not a date", () => {
    const result = isDate("2021-01-01")
    expect(result).toBe(false)
  })
})
