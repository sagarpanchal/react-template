import { describe, it, expect } from "vitest"

import { CalculatorKeyboard } from "./CalculatorKeyboard"

import { Calculator } from "../Calculator"

describe("Calculator", () => {
  const calc = new Calculator()
  const calcCtrl = new CalculatorKeyboard(calc)

  it("should enable shortcuts", () => {
    calc.clear()
    calcCtrl.enableShortcuts()
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    expect(calc.literals).toEqual(["1"])
  })

  it("should handle shortcuts", () => {
    calc.clear()
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    window.dispatchEvent(new KeyboardEvent("keyup", { key: Calculator.Operators.Plus }))
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "1"])

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Delete" }))
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus])

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Backspace" }))
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "1"])

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Shift", isComposing: true }))
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "1"])

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Shift" }))
    expect(calc.literals).toEqual(["1", Calculator.Operators.Plus, "-1"])

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }))
    expect(calc.literals).toEqual(["0"])
    expect(calc.history.at(-1)).toEqual({ literals: ["1", Calculator.Operators.Plus, "-1"], result: "0" })

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }))
    expect(calc.literals).toEqual([])
  })

  it("should disable shortcuts", () => {
    calc.clear()
    calcCtrl.disableShortcuts()
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "1" }))
    expect(calc.literals).toEqual([])
  })
})
