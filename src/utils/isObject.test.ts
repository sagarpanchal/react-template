import { describe, expect, it } from "vitest"

import { isObject } from "./isObject"

describe("isObject", () => {
  it("should return true for objects", () => {
    expect(isObject({})).toBe(true)
  })
})
