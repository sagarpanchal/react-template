import { describe, expect, it } from "vitest"

import { isEmptyString } from "./isEmptyString"

describe("isEmptyString", () => {
  it("should return true for empty string", () => {
    expect(isEmptyString("")).toBe(true)
  })

  it("should return true for whitespace string", () => {
    expect(isEmptyString(" ")).toBe(true)
  })

  it("should return false for non-empty string", () => {
    expect(isEmptyString("test")).toBe(false)
  })
})
