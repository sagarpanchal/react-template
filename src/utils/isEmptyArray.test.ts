import { describe, expect, it } from "vitest"

import { isEmptyArray } from "./isEmptyArray"

describe("isEmptyArray", () => {
  it("should return true for empty arrays", () => {
    expect(isEmptyArray([])).toBe(true)
  })

  it("should return false for non-empty arrays", () => {
    expect(isEmptyArray([1])).toBe(false)
  })
})
