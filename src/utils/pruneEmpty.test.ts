import { describe, expect, it } from "vitest"

import { pruneEmpty } from "./pruneEmpty"

describe("pruneEmpty", () => {
  it("should remove empty values", () => {
    const result = pruneEmpty([
      1,
      2,
      null,
      [4, 5, 6, [7, 8, undefined, []]],
      { a: 1, b: 2, c: null, d: { e: 4, f: 5, g: 6, h: { i: 7, j: 8, k: undefined, l: {} } } },
    ])
    const expected = [1, 2, [4, 5, 6, [7, 8]], { a: 1, b: 2, d: { e: 4, f: 5, g: 6, h: { i: 7, j: 8 } } }]
    expect(result).toEqual(expected)
  })
})
