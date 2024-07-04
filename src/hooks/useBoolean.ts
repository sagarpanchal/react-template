import React from "react"

export type UseBooleanSetter = {
  readonly set: (value: boolean) => void
  readonly true: () => void
  readonly false: () => void
  readonly toggle: () => void
}

export function useBoolean(initialValue: boolean | (() => boolean) = false) {
  const [state, _setState] = React.useState(Boolean(initialValue))

  const setState = React.useMemo(() => {
    return {
      set: (value: boolean) => _setState(value),
      true: () => _setState(true),
      false: () => _setState(false),
      toggle: () => _setState((v) => !v),
    } satisfies UseBooleanSetter
  }, [])

  React.useDebugValue(state)
  return [state, setState] as const
}
