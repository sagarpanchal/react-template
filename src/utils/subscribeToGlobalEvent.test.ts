import { describe, expect, it, vi } from "vitest"

import { subscribeToGlobalEvent } from "./subscribeToGlobalEvent"

describe("subscribeToGlobalEvent", () => {
  it("should subscribe to global event", () => {
    const fn = vi.fn()
    subscribeToGlobalEvent("click", fn)
    global.dispatchEvent(new Event("click"))
    expect(fn).toBeCalledTimes(1)
  })

  it("should unsubscribe from global event", () => {
    const fn = vi.fn()
    const unsubscribe = subscribeToGlobalEvent("click", fn)
    unsubscribe()
    global.dispatchEvent(new Event("click"))
    expect(fn).toBeCalledTimes(0)
  })
})
