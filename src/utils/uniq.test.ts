import { describe, expect, it } from "vitest"

import { uniq } from "./uniq"

describe("uniq", () => {
  it("should remove duplicates", () => {
    expect(uniq([1, 2, 3, 2, 1])).toEqual([1, 2, 3])
  })
})
