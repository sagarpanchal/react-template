import { describe, expect, it } from "vitest"

import { popUrlPathSegment } from "./popUrlPathSegment"

describe("popUrlPathSegment", () => {
  it("should return the URL with the last path segment removed", () => {
    const updatedUrl = popUrlPathSegment(new URL("https://example.com/foo/bar?q=1#baz"))
    expect(updatedUrl.href).toBe("https://example.com/foo?q=1#baz")
  })

  it("should return the URL when there is only one path segment", () => {
    const updatedUrl = popUrlPathSegment(new URL("https://example.com/foo?q=1#baz"))
    expect(updatedUrl.href).toBe("https://example.com/?q=1#baz")
  })

  it("should return the URL when there is no path", () => {
    const updatedUrl = popUrlPathSegment(new URL("https://example.com?q=1#baz"))
    expect(updatedUrl.href).toBe("https://example.com/?q=1#baz")
  })
})
