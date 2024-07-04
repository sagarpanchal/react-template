import { describe, expect, it } from "vitest"

import { removeUrlQueryString } from "./removeUrlQueryString"

describe("removeUrlQueryString", () => {
  it("should return the URL with the query string removed", () => {
    const updatedUrl = removeUrlQueryString(new URL("https://example.com/foo/bar?q=1#baz"))
    expect(updatedUrl.href).toBe("https://example.com/foo/bar#baz")
  })

  it("should return the URL when there is no query string", () => {
    const updatedUrl = removeUrlQueryString(new URL("https://example.com/foo/bar#baz"))
    expect(updatedUrl.href).toBe("https://example.com/foo/bar#baz")
  })
})
