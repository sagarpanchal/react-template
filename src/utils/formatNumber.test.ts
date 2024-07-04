import { describe, expect, it } from "vitest"

import { formatNumber } from "./formatNumber"

describe("formatNumber", () => {
  it("should format number", () => {
    expect(formatNumber(123456.789)).toBe("123,456.789")
  })

  it("should format number with fraction length", () => {
    expect(formatNumber(123456.789, 2)).toBe("123,456.79")
  })

  it("should format number with fraction length options", () => {
    expect(formatNumber(123456.789, { fractionLength: 2 })).toBe("123,456.79")
  })

  it("should format number with max fraction length options (dynamic fraction length)", () => {
    expect(formatNumber(123456.789, { maximumFractionDigits: 2 })).toBe("123,456.79")
  })

  it("should format number with min fraction length options (dynamic fraction length)", () => {
    expect(formatNumber(123456.78, { minimumFractionDigits: 3 })).toBe("123,456.780")
  })

  it("should ignore non number input", () => {
    expect(formatNumber(NaN)).toBe("")
    expect(formatNumber(undefined)).toBe("")
    expect(formatNumber({})).toBe("")
  })
})
