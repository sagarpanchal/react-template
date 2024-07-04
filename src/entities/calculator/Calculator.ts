import { createStore } from "zustand"

export class Calculator {
  static Operators = {
    Divide: "/",
    Multiply: "*",
    Plus: "+",
    Minus: "-",
    Percentage: "%",
  }

  static OperatorPrecedence = {
    [Calculator.Operators.Divide]: 2,
    [Calculator.Operators.Multiply]: 2,
    [Calculator.Operators.Plus]: 1,
    [Calculator.Operators.Minus]: 1,
  }

  static DisplayOperators = {
    Divide: "÷",
    Multiply: "x",
    Plus: "+",
    Minus: "-",
    Percentage: "%",
  }

  static OperatorToDisplayOperatorMap = {
    [Calculator.Operators.Divide]: Calculator.DisplayOperators.Divide,
    [Calculator.Operators.Multiply]: Calculator.DisplayOperators.Multiply,
    [Calculator.Operators.Plus]: Calculator.DisplayOperators.Plus,
    [Calculator.Operators.Minus]: Calculator.DisplayOperators.Minus,
    [Calculator.Operators.Percentage]: Calculator.DisplayOperators.Percentage,
  }

  static DisplayOperatorToOperatorMap = {
    [Calculator.DisplayOperators.Divide]: Calculator.Operators.Divide,
    [Calculator.DisplayOperators.Multiply]: Calculator.Operators.Multiply,
    [Calculator.DisplayOperators.Plus]: Calculator.Operators.Plus,
    [Calculator.DisplayOperators.Minus]: Calculator.Operators.Minus,
    [Calculator.DisplayOperators.Percentage]: Calculator.Operators.Percentage,
  }

  static literalsToDisplayLiterals(literals: string[]) {
    return literals.map((literal) => Calculator.OperatorToDisplayOperatorMap[literal] ?? literal)
  }

  store = createStore(() => ({
    literals: [] as string[],
    history: [
      {
        literals: ["2", "*", "4", "-", "2", "/", "2"],
        result: "7",
      },
    ] as { literals: string[]; result: string }[],
  }))

  get history() {
    return this.store.getState().history
  }

  set history(history: { literals: string[]; result: string }[]) {
    this.store.setState({ history })
  }

  get literals() {
    return this.store.getState().literals
  }

  set literals(literals: string[]) {
    this.store.setState({ literals })
  }

  get result() {
    return this.calculateResult(this.store.getState())
  }

  toggleNumberSign() {
    if (this.literals.length < 1) return this
    const latestLiteralIndex = this.literals.length - 1
    const latestLiteralIsNumber = this.isNumericLiteral(this.literals[latestLiteralIndex])
    const latestLiteral = this.literals[latestLiteralIndex]

    if (!latestLiteralIsNumber) return this

    const newLiterals = [...this.literals]
    newLiterals[latestLiteralIndex] = latestLiteral.startsWith("-") ? latestLiteral.slice(1) : `-${latestLiteral}`
    this.literals = newLiterals
    return this
  }

  addLiteral(literal: string) {
    const latestLiteralIndex = this.literals.length > 0 ? this.literals.length - 1 : 0
    const latestLiteral = this.literals[latestLiteralIndex] ?? ""

    const inputLiteralIsNumber = this.isNumericLiteral(literal)
    const inputLiteralIsOperator = this.isOperatorLiteral(literal)
    const latestLiteralIsNumber = this.isNumericLiteral(latestLiteral)
    const latestLiteralIsEmpty = latestLiteral === ""
    const latestLiteralIsOperator = this.isOperatorLiteral(latestLiteral)
    const latestLiteralIncludesDot = latestLiteral.includes(".")
    const inputLiteralIsDot = literal === "."

    if (literal === "%") {
      const a = Number(this.literals.at(-3))
      const b = Number(this.literals.at(-1))
      if (Number.isNaN(a) || Number.isNaN(b)) return this

      const percentage = this.formatResult((a * b) / 100)
      this.literals = this.literals.with(this.literals.length - 1, percentage)
      return this
    }

    switch (true) {
      case inputLiteralIsDot && latestLiteralIncludesDot: {
        break
      }

      case inputLiteralIsDot && latestLiteralIsEmpty:
      case inputLiteralIsDot && latestLiteralIsOperator: {
        this.literals = [...this.literals, "0."]
        break
      }

      case inputLiteralIsOperator && latestLiteralIsOperator: {
        const newLiterals = [...this.literals]
        newLiterals[latestLiteralIndex] = literal
        this.literals = newLiterals
        break
      }

      case inputLiteralIsDot && latestLiteralIsNumber: // DOT
      case inputLiteralIsNumber && latestLiteralIsNumber: {
        const newLiterals = [...this.literals]
        newLiterals[latestLiteralIndex] = `${newLiterals[latestLiteralIndex]}${literal}`
        this.literals = newLiterals
        break
      }

      case inputLiteralIsOperator && latestLiteralIsNumber:
      case inputLiteralIsNumber && latestLiteralIsEmpty:
      case inputLiteralIsNumber && latestLiteralIsOperator: {
        this.literals = [...this.literals, literal]
        break
      }
    }

    return this
  }

  calculateResult(state: ReturnType<typeof this.store.getState>) {
    if (state.literals.length < 2) return ""
    const literals = [...state.literals]

    // Remove any non-numeric characters from the end of the array
    while (
      literals.length > 0 &&
      !this.isNumericLiteral(literals.at(-1)!) // last literal is not a number
    ) {
      literals.pop()
    }

    const result = this.evaluateExpression(literals)
    if (typeof result !== "string") return ""
    if (result === literals.join("")) return ""
    if (result === "NaN") return "ERROR"
    return result
  }

  saveCurrentExpressionToHistory() {
    if (this.literals.length < 2) return this
    if (this.result.length < 1) return this

    const lastEntry = this.history.at(-1)
    if (lastEntry && lastEntry.literals.join("") === this.literals.join("")) return this

    this.history = [...this.history, { literals: this.literals, result: this.result }]
    return this
  }

  loadFromHistory(index: number) {
    this.saveCurrentExpressionToHistory()
    const historyItem = this.history[index]
    if (!historyItem) return this
    this.literals = historyItem.literals
    return this
  }

  deleteFromHistory(index: number) {
    this.history = this.history.filter((_, i) => i !== index)
    return this
  }

  clear() {
    if (this.literals.length < 1) return this
    this.saveCurrentExpressionToHistory()
    this.literals = []
    return this
  }

  clearLastLiteral() {
    if (this.literals.length < 1) return this
    this.literals = this.literals.slice(0, -1)
    return this
  }

  clearLastLetter() {
    if (this.literals.length < 1) return this

    const lastLiteralIndex = this.literals.length - 1
    const lastLiteral = this.literals[lastLiteralIndex]

    if (lastLiteral.length < 2) {
      return this.clearLastLiteral()
    } else {
      this.literals = this.literals.with(lastLiteralIndex, lastLiteral.slice(0, -1))
    }

    return this
  }

  carryResultToNewLiteral() {
    if (this.literals.length < 1) return this
    if (this.result.length < 1) return this
    this.saveCurrentExpressionToHistory()
    this.literals = this.isNumericLiteral(this.result) ? [this.result] : []
    return this
  }

  private isOperatorLiteral(literal: string) {
    return Object.values(Calculator.Operators).includes(literal as keyof typeof Calculator.Operators)
  }

  private isNumericLiteral(literal: string) {
    return /^-?\d+(\.\d*)?$/.test(literal)
  }

  private hasHigherPrecedence(operatorA: string, operatorB: string) {
    return Calculator.OperatorPrecedence[operatorA] >= Calculator.OperatorPrecedence[operatorB]
  }

  private formatNumber = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 11,
    useGrouping: false,
  }).format

  private formatResult(number: number | bigint) {
    return parseFloat(this.formatNumber(number)).toString()
  }

  private evaluateExpression(literals: string[]) {
    const reversePolishNotation = this.getReversePolishNotation(literals)
    return this.parseReversePolishNotation(reversePolishNotation)
  }

  private getReversePolishNotation(literals: string[]) {
    const output: string[] = []
    const ops: string[] = []

    for (const literal of literals) {
      if (this.isOperatorLiteral(literal)) {
        while (ops.length > 0 && this.hasHigherPrecedence(ops[ops.length - 1], literal)) {
          output.push(ops.pop()!)
        }
        ops.push(literal)
      } else {
        output.push(literal)
      }
    }

    while (ops.length > 0) {
      output.push(ops.pop()!)
    }

    return output
  }

  private parseReversePolishNotation(tokens: string[]) {
    const stack: string[] = []

    for (const token of tokens) {
      if (!this.isOperatorLiteral(token)) {
        stack.push(token)
        continue
      }

      const [b, a] = [Number(stack.pop()), Number(stack.pop())]

      switch (token) {
        case Calculator.Operators.Plus:
          stack.push(this.formatResult(a + b))
          break

        case Calculator.Operators.Minus:
          stack.push(this.formatResult(a - b))
          break

        case Calculator.Operators.Multiply:
          stack.push(this.formatResult(a * b))
          break

        case Calculator.Operators.Divide:
          stack.push(this.formatResult(a / b))
          break
      }
    }

    return stack.pop()
  }
}
