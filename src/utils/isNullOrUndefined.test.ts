import { describe, expect, it } from "vitest"

import { isNullOrUndefined } from "./isNullOrUndefined"

describe("isNullOrUndefined", () => {
  it("returns true for null", () => {
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
  })
})
