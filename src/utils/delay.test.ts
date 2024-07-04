import { describe, it, expect } from "vitest"

import { delay } from "./delay"
import { timeSpan } from "./timeSpan"

describe("delay", () => {
  it("should delay", async () => {
    const end = timeSpan()
    const ms = 100
    await delay(ms)
    expect(end.ceil()).toBeGreaterThanOrEqual(ms)
  })
})
