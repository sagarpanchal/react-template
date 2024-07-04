import { expect, describe, test as it } from "vitest"

import { resizeToFit } from "./resizeToFit"

describe("resizeToFit", () => {
  const SQUARE = { height: 200, width: 200 }
  const LANDSCAPE = { height: 100, width: 200 }
  const PORTRAIT = { height: 200, width: 100 }

  describe("should contain", () => {
    describe("square parents", () => {
      it("and square children", () => {
        const result = resizeToFit("contain", { width: 50, height: 50 }, SQUARE)
        const expected = { width: 200, height: 200, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("contain", { width: 100, height: 50 }, SQUARE)
        const expected = { width: 200, height: 100, x: 0, y: 50 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("contain", { width: 50, height: 100 }, SQUARE)
        const expected = { width: 100, height: 200, x: 50, y: 0 }
        expect(result).toEqual(expected)
      })
    })

    describe("landscape parents", () => {
      it("and square children", () => {
        const result = resizeToFit("contain", { width: 50, height: 50 }, LANDSCAPE)
        const expected = { width: 100, height: 100, x: 50, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("contain", { width: 100, height: 50 }, LANDSCAPE)
        const expected = { width: 200, height: 100, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("contain", { width: 50, height: 100 }, LANDSCAPE)
        const expected = { width: 50, height: 100, x: 75, y: 0 }
        expect(result).toEqual(expected)
      })
    })

    describe("portrait parents", () => {
      it("and square children", () => {
        const result = resizeToFit("contain", { width: 50, height: 50 }, PORTRAIT)
        const expected = { width: 100, height: 100, x: 0, y: 50 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("contain", { width: 100, height: 50 }, PORTRAIT)
        const expected = { width: 100, height: 50, x: 0, y: 75 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("contain", { width: 50, height: 100 }, PORTRAIT)
        const expected = { width: 100, height: 200, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })
    })
  })

  describe("should cover", () => {
    describe("square parents", () => {
      it("and square children", () => {
        const result = resizeToFit("cover", { width: 50, height: 50 }, SQUARE)
        const expected = { width: 200, height: 200, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("cover", { width: 100, height: 50 }, SQUARE)
        const expected = { width: 400, height: 200, x: -100, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("cover", { width: 50, height: 100 }, SQUARE)
        const expected = { width: 200, height: 400, x: 0, y: -100 }
        expect(result).toEqual(expected)
      })
    })

    describe("landscape parents", () => {
      it("and square children", () => {
        const result = resizeToFit("cover", { width: 50, height: 50 }, LANDSCAPE)
        const expected = { width: 200, height: 200, x: 0, y: -50 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("cover", { width: 100, height: 50 }, LANDSCAPE)
        const expected = { width: 200, height: 100, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("cover", { width: 50, height: 100 }, LANDSCAPE)
        const expected = { width: 200, height: 400, x: 0, y: -150 }
        expect(result).toEqual(expected)
      })
    })

    describe("portrait parents", () => {
      it("and square children", () => {
        const result = resizeToFit("cover", { width: 50, height: 50 }, PORTRAIT)
        const expected = { width: 200, height: 200, x: -50, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and landscape children", () => {
        const result = resizeToFit("cover", { width: 100, height: 50 }, PORTRAIT)
        const expected = { width: 400, height: 200, x: -150, y: 0 }
        expect(result).toEqual(expected)
      })

      it("and portrait children", () => {
        const result = resizeToFit("cover", { width: 50, height: 100 }, PORTRAIT)
        const expected = { width: 100, height: 200, x: 0, y: 0 }
        expect(result).toEqual(expected)
      })
    })
  })
})
