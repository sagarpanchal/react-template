import { describe, it, expect } from "vitest"

import { castToNumber } from "./castToNumber"

describe("castToNumber", () => {
  describe("should cast boolean", () => {
    it("to number", () => {
      expect(castToNumber(true)).toBe(1)
      expect(castToNumber(false)).toBe(0)
    })
  })

  describe("should cast number", () => {
    it("to number", () => {
      const number = Math.random()
      expect(castToNumber(number)).toBe(number)
    })

    it("with exponential notation to number", () => {
      const number = Math.random().toExponential(100)
      expect(castToNumber(number)).toBe(Number(number))
    })
  })

  describe("should cast string", () => {
    it("with number to number", () => {
      expect(castToNumber("a1.1$")).toBe(1.1)
    })

    it("with exponential to number", () => {
      expect(castToNumber("-12.34e-2")).toBe(-0.1234)
    })
  })

  describe("should ignore", () => {
    it("undefined", () => {
      expect(castToNumber(undefined)).toBe(undefined)
    })

    it("null", () => {
      expect(castToNumber(null)).toBe(undefined)
    })

    it("NaN", () => {
      expect(castToNumber(NaN)).toBe(undefined)
    })

    it("Infinity", () => {
      expect(castToNumber(Infinity)).toBe(undefined)
    })

    it("string without number", () => {
      expect(castToNumber("abc$")).toBe(undefined)
    })

    it("string containing invalid number", () => {
      expect(castToNumber("1.1.1")).toBe(undefined)
    })
  })
})
