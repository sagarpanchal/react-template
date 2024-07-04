import { describe, expect, it } from "vitest"

import { cx } from "./cx"

describe("cx", () => {
  it("should return a string only string", () => {
    expect(cx("foo", "bar")).toBe("foo bar")
  })
})
