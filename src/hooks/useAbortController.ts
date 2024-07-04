import React from "react"

export function useAbortController() {
  const abortControllerRef = React.useRef<AbortController | undefined>()

  const getAbortController = React.useCallback(() => {
    abortControllerRef.current =
      abortControllerRef.current && !abortControllerRef.current.signal.aborted
        ? abortControllerRef.current
        : new AbortController()
    return abortControllerRef.current
  }, [])

  const getSignal = React.useCallback(() => {
    return getAbortController().signal
  }, [getAbortController])

  React.useEffect(() => {
    return () => {
      getAbortController().abort("Re-render")
    }
  }, [getAbortController])

  return getSignal
}
