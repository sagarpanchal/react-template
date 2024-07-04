import { describe, expect, it } from "vitest"

import { isFunction } from "./isFunction"

describe("isFunction", () => {
  it("returns true for functions", () => {
    expect(isFunction(() => {})).toBe(true)
    // eslint-disable-next-line prefer-arrow-callback
    expect(isFunction(function named() {})).toBe(true)
  })
})
