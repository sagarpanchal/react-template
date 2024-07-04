import { describe, it, expect } from "vitest"

import { delay } from "./delay"
import { inRange } from "./inRange"
import { timeSpan } from "./timeSpan"

describe("timeSpan", () => {
  it("should return the time elapsed since the start", async () => {
    const end = timeSpan()
    await delay(100)
    expect(inRange(end(), { start: 80, end: 120 })).toBe(true)
    expect(inRange(end.ceil(), { start: 80, end: 120 })).toBe(true)
    expect(inRange(end.round(), { start: 80, end: 120 })).toBe(true)
    expect(inRange(end.seconds(), { start: 0.08, end: 0.12 })).toBe(true)
    expect(inRange(end.nanoseconds(), { start: 80000000, end: 120000000 })).toBe(true)
  })
})
