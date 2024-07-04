import React from "react"

import { useStore } from "zustand"

import { faClockRotateLeft, faKeyboard, faTrash, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"

import { Calculator } from "../../entities/calculator/Calculator"
import { CalculatorKeyboard } from "../../entities/calculator/extensions/CalculatorKeyboard"
import { useBoolean } from "../../hooks/useBoolean"
import { cx } from "../../utils/cx"
import { isEmptyArray } from "../../utils/isEmptyArray"
import { isEmptyString } from "../../utils/isEmptyString"

const calculator = new Calculator()
const calculatorKeyboard = new CalculatorKeyboard(calculator).enableShortcuts()

type CalcButtonProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  literal: string
}

const CalcButton: React.NamedExoticComponent<CalcButtonProps> = React.memo((props) => {
  const { className, literal, onClick, ...restProps } = props

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick?.(event)
      calculator.addLiteral(Calculator.DisplayOperatorToOperatorMap[literal] ?? literal)
    },
    [literal, onClick],
  )

  return (
    <button className={cx("h-16 w-full", className)} onClick={handleClick} {...restProps}>
      {literal}
    </button>
  )
})
CalcButton.displayName = "CalcButton"

type CalculatorUIProps = React.ComponentPropsWithoutRef<"div"> & {
  wrapperClassName?: string
}

const CalculatorUI: React.FC<CalculatorUIProps> = (props) => {
  const {
    className: containerClassName = [
      "min-w-screen flex min-h-screen items-center justify-center px-5 py-5",
      "bg-gradient-to-b from-neutral-200 to-neutral-100",
      "dark:bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-800",
    ],
    wrapperClassName = "relative mx-auto w-full max-w-[512px] overflow-hidden rounded-xl text-gray-800 shadow-xl",
    ...containerProps
  } = props

  const [showHistory, setShowHistory] = useBoolean()
  const [showHints, setShowHints] = useBoolean()

  const history = useStore(calculator.store, (state) => state.history)
  const literals = useStore(calculator.store, (state) => state.literals)
  const result = useStore(calculator.store, (state) => calculator.calculateResult(state))

  const hasHistory = history.length > 0

  React.useEffect(() => {
    if (!hasHistory) setShowHistory.false()
  }, [hasHistory, setShowHistory])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key == "h") {
        if (hasHistory) setShowHistory.toggle()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [hasHistory, setShowHistory])

  return (
    <div {...containerProps} className={cx(containerClassName)}>
      <div className={cx(wrapperClassName)}>
        <div
          className={cx(
            "absolute right-0 top-0 h-full w-full rounded-r-xl bg-black bg-opacity-20 backdrop-blur-[1px] transition-all",
            showHistory ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={setShowHistory.false}
        ></div>
        <div
          className={cx(
            "absolute left-0 top-0 z-10 h-full w-3/4 rounded-l-xl bg-gradient-to-b from-gray-700 to-gray-800 text-white transition-all",
            showHistory ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 w-full items-center justify-between px-6">
            <div className="pt-5 text-2xl font-thin">History</div>
          </div>
          <div className="h-full overflow-y-auto">
            {history.map((history, index) => (
              <div
                key={index}
                className="flex w-full border-b border-gray-700 px-6 py-3 opacity-50"
                onClick={(event) => {
                  event.stopPropagation()
                  calculator.loadFromHistory(index)
                  setShowHistory.false()
                }}
              >
                <div className="font-mono text-sm font-thin">
                  {Calculator.literalsToDisplayLiterals(history.literals).join("")}
                  <span className="opacity-50">{"="}</span>
                  {history.result}
                </div>
                <button
                  role="button"
                  aria-label="Load from History"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    calculator.loadFromHistory(index)
                    setShowHistory.false()
                  }}
                  className="text-1xl ml-auto self-end text-white text-opacity-50 transition-all"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <button
                  role="button"
                  aria-label="Delete History"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    calculator.deleteFromHistory(index)
                  }}
                  className="text-1xl ml-3 self-end text-white text-opacity-50 transition-all"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-40 w-full items-end bg-gradient-to-b from-gray-800 to-gray-700 text-right">
          <button
            role="button"
            aria-label="Toggle Hints"
            tabIndex={0}
            onClick={setShowHints.toggle}
            className={cx("text-1xl absolute left-0 top-0 p-6 text-white text-opacity-50 transition-all")}
          >
            <FontAwesomeIcon icon={faKeyboard} />
          </button>
          <button
            role="button"
            aria-label="Toggle History"
            tabIndex={0}
            onClick={setShowHistory.toggle}
            className={cx(
              "text-1xl absolute right-0 top-0 p-6 text-white text-opacity-50 transition-all",
              !hasHistory ? "translate-x-full" : "translate-x-0",
            )}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </button>
          <div className="w-full px-6 py-5 font-mono text-3xl font-thin text-white">
            {!isEmptyArray(literals)
              ? literals.map((literal, index) => (
                  <span key={`${literal}-${index}`}>{Calculator.OperatorToDisplayOperatorMap[literal] ?? literal}</span>
                ))
              : "0"}
            {!isEmptyArray(literals) && !isEmptyString(result) && result !== literals.join("") && (
              <React.Fragment>
                <br />
                {literals.at(-1) !== "=" && <span className="opacity-50">{"="}</span>}
                {result}
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="w-full bg-gradient-to-b from-indigo-400 to-indigo-500">
          <div className="flex w-full">
            <div className="w-1/4 border-b border-r border-indigo-400">
              <button
                className="h-16 w-full text-xl font-light text-white text-opacity-50 hover:bg-indigo-700 hover:bg-opacity-20"
                onClick={() => calculator.clear()}
              >
                C
              </button>
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <button
                className="h-16 w-full text-xl font-light text-white text-opacity-50 hover:bg-indigo-700 hover:bg-opacity-20"
                onClick={() => calculator.toggleNumberSign()}
              >
                {Calculator.DisplayOperators.Plus}/{Calculator.DisplayOperators.Minus}
              </button>
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal={Calculator.DisplayOperators.Percentage}
                className="text-xl font-light text-white text-opacity-50 hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-indigo-400">
              <CalcButton
                literal={Calculator.DisplayOperators.Divide}
                className="bg-indigo-700 bg-opacity-10 text-2xl font-light text-white hover:bg-opacity-20"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="7"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="8"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="9"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-indigo-400">
              <CalcButton
                literal={Calculator.DisplayOperators.Multiply}
                className="bg-indigo-700 bg-opacity-10 text-xl font-light text-white hover:bg-opacity-20"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="4"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="5"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="6"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-indigo-400">
              <CalcButton
                literal={Calculator.DisplayOperators.Minus}
                className="bg-indigo-700 bg-opacity-10 text-xl font-light text-white hover:bg-opacity-20"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="1"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="2"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-r border-indigo-400">
              <CalcButton
                literal="3"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-b border-indigo-400">
              <CalcButton
                literal={Calculator.DisplayOperators.Plus}
                className="bg-indigo-700 bg-opacity-10 text-xl font-light text-white hover:bg-opacity-20"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/4 border-r border-indigo-400">
              <CalcButton
                literal="0"
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-1/4 border-r border-indigo-400">
              <CalcButton
                literal="."
                className="text-xl font-light text-white hover:bg-indigo-700 hover:bg-opacity-20"
              />
            </div>
            <div className="w-2/4">
              <button
                className="h-16 w-full bg-indigo-700 bg-opacity-30 text-xl font-light text-white hover:bg-opacity-40"
                onClick={() => calculator.carryResultToNewLiteral()}
              >
                =
              </button>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={showHints}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={setShowHints.false} role="alertdialog">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-gray-600/35 p-6 text-center backdrop-blur-2xl">
                  <DialogTitle as="h3" className="text-base/7 font-medium">
                    Keyboard Shortcuts
                  </DialogTitle>
                  <table className="mt-4 w-full text-sm/6">
                    <tbody className="mt-2">
                      <tr>
                        <td>
                          <kbd>Ctrl</kbd> + <kbd>H</kbd>
                        </td>
                        <td>Toggle History</td>
                      </tr>
                    </tbody>
                  </table>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
CalculatorUI.displayName = "Calculator"

export { CalculatorUI as Calculator }

if (import.meta.hot) {
  import.meta.hot.data.calculatorKeyboard = calculatorKeyboard
  import.meta.hot.dispose((data) => {
    console.debug(data.calculatorKeyboard)
    data.calculatorKeyboard?.disableKeyboardShortcuts?.()
  })

  // @ts-expect-error calculator
  window.calculator = calculator
  // @ts-expect-error calculatorKeyboard
  window.calculatorKeyboard = calculatorKeyboard
}
