import { describe, expect, it } from "vitest"

import { chain } from "./chain"

describe("chain", () => {
  it("should chain functions", () => {
    const object = chain("result").object()
    expect(object).toBe("result")

    const result = chain("result").result()
    expect(result).toBeUndefined()

    const objectWithDebug = chain("result")
      .call((str) => str)
      .object()
    expect(objectWithDebug).toBe("result")

    const resultWithDebug = chain("result")
      .call((str) => str + 1)
      .result()
    expect(resultWithDebug).toBe("result1")
  })
})
