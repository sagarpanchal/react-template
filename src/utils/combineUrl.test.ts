import { describe, expect, it } from "vitest"

import { combineUrl } from "./combineUrl"

describe("combineUrl", () => {
  it("should combine url parts", () => {
    const result = combineUrl("https://example.com/", "/api/", "/v1")
    expect(result).toBe("https://example.com/api/v1")
  })

  it("should combine url parts with undefined segment", () => {
    const result = combineUrl("https://example.com/", undefined, "/v1")
    expect(result).toBe("https://example.com/v1")
  })

  it("should combine url parts with undefined host", () => {
    const result = combineUrl(undefined, "/api/", "/v1")
    expect(result).toBe("/api/v1")
  })

  it("should combine url parts with undefined", () => {
    const result = combineUrl(undefined, undefined, undefined)
    expect(result).toBe("")
  })
})
