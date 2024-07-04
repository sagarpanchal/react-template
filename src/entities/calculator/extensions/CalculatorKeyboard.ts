import type { Calculator } from "../Calculator"

export class CalculatorKeyboard {
  constructor(private calculator: Calculator) {}

  private keyboardEventHandler = (event: KeyboardEvent) => {
    console.debug(event, event.isComposing)
    if (event.isComposing) return

    switch (event.key) {
      case "Escape": {
        this.calculator.clear()
        break
      }

      case "Delete": {
        this.calculator.clearLastLiteral()
        break
      }

      case "Backspace": {
        this.calculator.clearLastLetter()
        break
      }

      case "Shift": {
        this.calculator.toggleNumberSign()
        break
      }

      case "Enter": {
        this.calculator.carryResultToNewLiteral()
        break
      }

      default: {
        this.calculator.addLiteral(event.key)
        break
      }
    }
  }

  enableShortcuts() {
    window.addEventListener("keyup", this.keyboardEventHandler)
    return this
  }

  disableShortcuts() {
    window.removeEventListener("keyup", this.keyboardEventHandler)
    return this
  }
}
