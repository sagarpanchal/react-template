import { describe, expect, it } from "vitest"

import { isEmptyObject } from "./isEmptyObject"

describe("isEmptyObject", () => {
  it("empty object", () => {
    expect(isEmptyObject({})).toBe(true)
  })

  it("non-empty object", () => {
    expect(isEmptyObject({ foo: "bar" })).toBe(false)
  })
})
