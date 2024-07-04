import { describe, expect, it } from "vitest"

import { debounce } from "./debounce"

describe("debounce", () => {
  it("should debounce", async () => {
    let count = 0
    const debounced = debounce(() => count++, 100)
    debounced()
    debounced()

    expect(count).toBe(0)
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(count).toBe(1)
  })

  it("should cancel", async () => {
    let count = 0
    const debounced = debounce(() => count++, 100)
    debounced()
    debounced.cancel()

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(count).toBe(0)
  })
})
