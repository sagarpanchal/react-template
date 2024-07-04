import { describe, expect, it } from "vitest"

import { removeUrlHash } from "./removeUrlHash"

describe("removeUrlHash", () => {
  it("should return the URL with the hash removed", () => {
    const updatedUrl = removeUrlHash(new URL("https://example.com/foo?q=1#baz"))
    expect(updatedUrl.href).toBe("https://example.com/foo?q=1")
  })

  it("should return the URL when there is no hash", () => {
    const updatedUrl = removeUrlHash(new URL("https://example.com/foo?q=1"))
    expect(updatedUrl.href).toBe("https://example.com/foo?q=1")
  })
})
