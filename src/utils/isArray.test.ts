import { describe, expect, it } from "vitest"

import { isArray } from "./isArray"

describe("isArray", () => {
  it("should return true for arrays", () => {
    expect(isArray([])).toBe(true)
  })
})
