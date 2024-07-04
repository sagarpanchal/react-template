import React from "react"

import { useCounter } from "./useCounter"

import { LoaderService } from "../services/LoaderService"
import { isNumber } from "../utils/isNumber"

export function useLoading(show = false) {
  const [count, inc, dec] = useCounter(0)
  const countRef = React.useRef(count)
  const showRef = React.useRef(show)

  React.useEffect(() => {
    countRef.current = count
  }, [count])

  const start = React.useCallback(() => {
    inc()
    showRef.current && LoaderService.startLoading
  }, [inc])

  const stop = React.useCallback(() => {
    dec()
    showRef.current && LoaderService.stopLoading
  }, [dec])

  React.useEffect(() => {
    const show = showRef.current

    return () => {
      if (show && isNumber(countRef.current) && countRef.current > 0) {
        LoaderService.adjustCount = -Math.abs(countRef.current)
      }
    }
  }, [])

  React.useDebugValue(count)
  return [Boolean(count), start, stop] as const
}
