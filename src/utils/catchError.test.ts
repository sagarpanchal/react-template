import { describe, expect, it } from "vitest"

import { catchError } from "./catchError"

describe("catchError", () => {
  const error = new Error("error message")

  it("should handle functions", () => {
    const result = catchError(() => "result")
    expect(result).toBe("result")
  })

  it("should handle errors", () => {
    const result = catchError(
      () => {
        throw error
      },
      (e) => e,
    )
    expect(result).toEqual(error)
  })

  it("should handle promises error", async () => {
    const result = await catchError(
      () => {
        return new Promise((_, reject) => {
          reject(error)
        })
      },
      (e) => e,
    )
    expect(result).toEqual(error)
  })
})
