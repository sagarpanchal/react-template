import { describe, expect, it } from "vitest"

import { isUndefined } from "./isUndefined"

describe("isUndefined", () => {
  it("should return true for undefined", () => {
    expect(isUndefined(undefined)).toBe(true)
  })
})
