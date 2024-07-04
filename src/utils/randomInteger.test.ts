import { describe, it, expect } from "vitest"

import { inRange } from "./inRange"
import { randomInteger } from "./randomInteger"

describe("randomInteger", () => {
  it("should return a random integer", () => {
    expect(inRange(randomInteger(1), { start: 0, end: 1 })).toBe(true)
    expect(inRange(randomInteger(10), { start: 0, end: 10 })).toBe(true)
    expect(inRange(randomInteger(-10, -5), { start: -10, end: -5 })).toBe(true)
    expect(inRange(randomInteger(524234213, 99999999999), { start: 524234213, end: 99999999999 })).toBe(true)
  })

  it("should throw an error if the first argument is not a number", () => {
    expect(() => randomInteger("1" as unknown as number)).toThrow("Expected all arguments to be numbers")
  })
})
