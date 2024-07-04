import { describe, expect, it } from "vitest"

import { Replacer, stringify } from "./stringify"

describe("stringify", () => {
  it("should handle custom comparison function", () => {
    const obj = { c: 8, b: [{ z: 6, y: 5, x: 4 }, 7], a: 3 }
    const s = stringify(obj, (a, b) => {
      return a.key < b.key ? 1 : -1
    })
    expect(s).toBe('{"c":8,"b":[{"z":6,"y":5,"x":4},7],"a":3}')
  })

  it("should handle nested", () => {
    const obj = stringify({ c: 8, b: [{ z: 6, y: 5, x: 4 }, 7], a: 3 })
    expect(obj).toBe('{"a":3,"b":[{"x":4,"y":5,"z":6},7],"c":8}')
  })

  it("should handle nested: cyclic", () => {
    const one: any = { a: 1 }
    const two: any = { a: 2, one: one }
    one.two = two
    try {
      stringify(one)
    } catch (ex: unknown) {
      expect((ex as Error).toString()).toBe("TypeError: Converting circular structure to JSON")
    }
  })

  it("should handle nested: cyclic (specifically allowed)", () => {
    const one: any = { a: 1 }
    const two: any = { a: 2, one: one }
    one.two = two
    const result = stringify(one, { cycles: true })
    expect(result).toBe('{"a":1,"two":{"a":2,"one":"__cycle__"}}')
  })

  it("should handle nested: repeated non-cyclic value", () => {
    const one: any = { x: 1 }
    const two: any = { a: one, b: one }
    const result = stringify(two)
    expect(result).toBe('{"a":{"x":1},"b":{"x":1}}')
  })

  it("should handle nested: acyclic but with reused obj-property pointers", () => {
    const one: any = { a: 1 }
    const two = { b: one, c: one }
    const result = stringify(two)
    expect(result).toBe('{"b":{"a":1},"c":{"a":1}}')
  })

  it("should replace root", () => {
    const obj = { a: 1, b: 2, c: false }
    const replacer: Replacer = () => "one"
    const result = stringify(obj, { replacer })
    expect(result).toBe('"one"')
  })

  it("should replace numbers", () => {
    const obj = { a: 1, b: 2, c: false }
    const replacer: Replacer = function (_, value) {
      if (value === 1) return "one"
      if (value === 2) return "two"
      return value
    }

    const result = stringify(obj, { replacer })
    expect(result).toBe('{"a":"one","b":"two","c":false}')
  })

  it("should replace with object", () => {
    const obj = { a: 1, b: 2, c: false }
    const replacer: Replacer = function (key, value) {
      if (key === "b") return { d: 1 }
      if (value === 1) return "one"
      return value
    }

    const result = stringify(obj, { replacer })
    expect(result).toBe('{"a":"one","b":{"d":"one"},"c":false}')
  })

  it("should replace with undefined", () => {
    const obj = { a: 1, b: 2, c: false }
    const replacer: Replacer = function (_, value) {
      if (value === false) return
      return value
    }

    const result = stringify(obj, { replacer })
    expect(result).toBe('{"a":1,"b":2}')
  })

  it("should replace with array", () => {
    const obj = { a: 1, b: 2, c: false }
    const replacer: Replacer = function (key, value) {
      if (key === "b") return ["one", "two"]
      return value
    }

    const result = stringify(obj, { replacer })
    expect(result).toBe('{"a":1,"b":["one","two"],"c":false}')
  })

  it("should replace array item", () => {
    const obj = { a: 1, b: 2, c: [1, 2] }
    const replacer: Replacer = function (_, value) {
      if (value === 1) return "one"
      if (value === 2) return "two"
      return value
    }

    const result = stringify(obj, { replacer })
    expect(result).toBe('{"a":"one","b":"two","c":["one","two"]}')
  })

  it("should handle space parameter", () => {
    const obj = { one: 1, two: 2 }
    expect(stringify(obj, { space: "  " })).toBe('{\n  "one": 1,\n  "two": 2\n}')
  })

  it("should handle space parameter (with tabs)", () => {
    const obj = { one: 1, two: 2 }
    expect(stringify(obj, { space: "\t" })).toBe('{\n\t"one": 1,\n\t"two": 2\n}')
  })

  it("should handle space parameter (with a number)", () => {
    const obj = { one: 1, two: 2 }
    expect(stringify(obj, { space: 3 })).toBe('{\n   "one": 1,\n   "two": 2\n}')
  })

  it("should handle space parameter (nested objects)", () => {
    const obj = { one: 1, two: { b: 4, a: [2, 3] } }
    expect(stringify(obj, { space: "  " })).toBe(
      "{\n" +
        '  "one": 1,\n' +
        '  "two": {\n' +
        '    "a": [\n' +
        "      2,\n" +
        "      3\n" +
        "    ],\n" +
        '    "b": 4\n' +
        "  }\n" +
        "}",
    )
  })

  it("should handle space parameter (same as native)", () => {
    // for this test, properties need to be in alphabetical order
    const obj = { one: 1, two: { a: [2, 3], b: 4 } }
    expect(stringify(obj, { space: "  " })).toBe(JSON.stringify(obj, null, "  "))
  })

  it("should handle simple object", () => {
    const obj = { c: 6, b: [4, 5], a: 3, z: null }
    expect(stringify(obj)).toBe('{"a":3,"b":[4,5],"c":6,"z":null}')
  })

  it("should handle object with undefined", () => {
    const obj = { a: 3, z: undefined }
    expect(stringify(obj)).toBe('{"a":3}')
  })

  it("should handle array with undefined", () => {
    const obj = [4, undefined, 6]
    expect(stringify(obj)).toBe("[4,null,6]")
  })

  it("should handle object with empty string", () => {
    const obj = { a: 3, z: "" }
    expect(stringify(obj)).toBe('{"a":3,"z":""}')
  })

  it("should handle array with empty string", () => {
    const obj = [4, "", 6]
    expect(stringify(obj)).toBe('[4,"",6]')
  })

  it("should handle toJSON function", () => {
    const obj = { one: 1, two: 2, toJSON: () => ({ one: 1 }) }
    expect(stringify(obj)).toBe('{"one":1}')
  })

  it("should handle toJSON returning string", () => {
    const obj = { one: 1, two: 2, toJSON: () => "one" }
    expect(stringify(obj)).toBe('"one"')
  })

  it("should handle toJSON returning array", () => {
    const obj = { one: 1, two: 2, toJSON: () => ["one"] }
    expect(stringify(obj)).toBe('["one"]')
  })
})
