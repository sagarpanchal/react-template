import { describe, it, expect } from "vitest"

import { Calculator } from "./Calculator"

describe("Calculator", () => {
  const calc = new Calculator()

  const history = {
    literals: [
      "2",
      Calculator.Operators.Plus,
      "3",
      Calculator.Operators.Minus,
      "4",
      Calculator.Operators.Multiply,
      "5",
      Calculator.Operators.Divide,
      "-6",
    ],
    result: "8.33333333333",
  }

  it("should evaluate expressions", () => {
    calc
      .addLiteral("2")
      .addLiteral(Calculator.Operators.Plus)
      .addLiteral("3")
      .addLiteral(Calculator.Operators.Minus)
      .addLiteral("4")
      .addLiteral(Calculator.Operators.Multiply)
      .addLiteral("5")
      .addLiteral(Calculator.Operators.Divide)
      .addLiteral("6")
      .toggleNumberSign()
    expect(calc.result).toBe(history.result)
  })

  it("should carry the result to the next expression", () => {
    calc.carryResultToNewLiteral()
    expect(calc.literals.at(0)).toBe(history.result)
  })

  it("should reset the expression", () => {
    calc.clear()
    expect(calc.literals).toEqual([])
  })

  it("should save expressions to history", () => {
    calc.clear()
    expect(calc.literals).toEqual([])
    expect(calc.result).toEqual("")
    expect(calc.history.at(1)).toEqual(history)
  })

  it("should load expressions from history", () => {
    calc.loadFromHistory(1)
    expect(calc.literals).toEqual(history.literals)
    expect(calc.result).toEqual(history.result)
  })

  it("should delete expressions from history", () => {
    calc.deleteFromHistory(0)
    expect(calc.history.at(0)).toEqual(history)
  })

  it("should clear last literal", () => {
    calc.clear()
    calc.clearLastLiteral()
    expect(calc.literals).toEqual([])

    calc.clear()
    calc.addLiteral("1").addLiteral(Calculator.Operators.Plus).addLiteral("2").clearLastLiteral()
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus])
  })

  it("should clear last letter", () => {
    calc.clear()
    calc.clearLastLetter()
    expect(calc.literals).toEqual([])

    calc.clear()
    calc.addLiteral("1").addLiteral(Calculator.Operators.Plus).addLiteral("2").clearLastLetter()
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus])

    calc.clear()
    calc.addLiteral("1").addLiteral(Calculator.Operators.Plus).addLiteral("2").addLiteral("3").clearLastLetter()
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "2"])
  })

  it("should handle percentage", () => {
    calc.clear()
    calc.addLiteral("10").addLiteral(Calculator.Operators.Plus).addLiteral("2").addLiteral("%")
    expect(calc.result).toBe("10.2")
  })

  it("should handle division by zero", () => {
    calc.clear()
    calc.addLiteral("10").addLiteral(Calculator.Operators.Divide).addLiteral("0")
    expect(calc.result).toBe("ERROR")
  })

  it("should handle all input cases", () => {
    // empty result
    calc.clear()
    calc.literals = ["", ""] // manually setting literals for 100% coverage
    expect(calc.result).toEqual("")

    // . 1 (empty decimal point)
    calc.clear().addLiteral(".").addLiteral("1")
    expect(calc.literals).toEqual(["0.1"])

    // . . (repeating decimal point)
    calc.clear().addLiteral(".").addLiteral(".")
    expect(calc.literals).toEqual(["0."])

    // 1 . (decimal point after number)
    calc.clear().addLiteral("1").addLiteral(".")
    expect(calc.literals).toEqual(["1."])

    // + . (decimal point after operator)
    calc.clear().addLiteral("1").addLiteral(Calculator.Operators.Plus).addLiteral(".")
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "0."])

    // % (empty percentage)
    calc.clear().addLiteral(Calculator.Operators.Percentage)
    expect(calc.literals).toEqual([])

    // 1 % (percentage after one number)
    calc.clear().addLiteral("1").addLiteral(Calculator.Operators.Percentage)
    expect(calc.literals).toEqual(["1"])

    // + + (repeating operators)
    calc.clear().addLiteral("1").addLiteral(Calculator.Operators.Plus).addLiteral(Calculator.Operators.Plus)
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus])

    // empty toggleNumberSign
    calc.clear().toggleNumberSign()
    expect(calc.literals).toEqual([])

    // 1 > toggleNumberSign
    calc.clear().addLiteral("1").toggleNumberSign()
    expect(calc.literals).toEqual(["-1"])

    // -1 > toggleNumberSign
    calc.clear().addLiteral("-1").toggleNumberSign()
    expect(calc.literals).toEqual(["1"])

    // 1 + > toggleNumberSign
    calc.clear().addLiteral("1").addLiteral(Calculator.Operators.Plus).toggleNumberSign()
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus])
  })

  it("should handle all loadFromHistory cases", () => {
    // load from empty history
    calc.clear().loadFromHistory(100)
    expect(calc.literals).toEqual([])
  })

  it("should handle all carryResultToNewLiteral cases", () => {
    // carryResultToNewLiteral with empty literals
    calc.clear().carryResultToNewLiteral()
    expect(calc.literals).toEqual([])

    // carryResultToNewLiteral with empty result
    calc.clear().addLiteral("1").carryResultToNewLiteral()
    expect(calc.literals).toEqual(["1"])

    // carryResultToNewLiteral when ERROR
    calc.clear().addLiteral("1").addLiteral(Calculator.Operators.Divide).addLiteral("0").carryResultToNewLiteral()
    expect(calc.literals).toEqual([])
  })

  it("should convert to display literals", () => {
    // literalsToDisplayLiterals
    expect(Calculator.literalsToDisplayLiterals(["1", Calculator.Operators.Divide, "2"])).toEqual([
      "1",
      Calculator.DisplayOperators.Divide,
      "2",
    ])
  })
})
