import { describe, expect, it } from "vitest"

import { isString } from "./isString"

describe("isString", () => {
  it("should return true if input is a string", () => {
    expect(isString("")).toBe(true)
  })
})
