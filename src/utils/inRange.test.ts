import { describe, it, expect } from "vitest"

import { inRange } from "./inRange"

describe("inRange", () => {
  it("should return true if the number is in the range", () => {
    expect(inRange(5, { end: 10 })).toBe(true)
  })

  it("should return false if the number is not in the range", () => {
    expect(inRange(5, { start: 10, end: 20 })).toBe(false)
  })

  it("should handle reversed range", () => {
    expect(inRange(5, { start: 10, end: 5 })).toBe(true)
  })

  it("should throw a TypeError if the number is not a number or BigInt", () => {
    expect(() => inRange("5" as unknown as number, { end: 10 })).toThrow(
      "Expected each argument to be either a number or a BigInt",
    )
  })
})
