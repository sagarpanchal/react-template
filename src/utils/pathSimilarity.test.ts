import { describe, expect, it } from "vitest"

import { pathSimilarity } from "./pathSimilarity"

describe("pathSimilarity", () => {
  it("should return the similarity between two matching paths", () => {
    const result = pathSimilarity(["src", "utils", "resizeToFit"], ["src", "utils", "resizeToFit"])
    const expected = { isEqual: true, slice: ["src", "utils", "resizeToFit"], size: 3, score: 1 }
    expect(result).toEqual(expected)
  })

  it("should return the similarity between two different paths", () => {
    const result = pathSimilarity(["src", "utils", "resizeToFit"], ["src", "utils", "pathSimilarity"])
    const expected = { isEqual: false, slice: ["src", "utils"], size: 2, score: 0.67 }
    expect(result).toEqual(expected)
  })
})
