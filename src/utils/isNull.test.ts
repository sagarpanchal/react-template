import { describe, expect, it } from "vitest"

import { isNull } from "./isNull"

describe("isNull", () => {
  it("returns true for null", () => {
    expect(isNull(null)).toBe(true)
  })
})
