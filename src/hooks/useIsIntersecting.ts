import React from "react"

import { catchError } from "../utils/catchError"
import { debounce } from "../utils/debounce"

type UseIsIntersectingOptions = IntersectionObserverInit & {
  freezeOnceVisible?: boolean
}

export function useIsIntersecting(
  ref: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLElement | undefined>,
  options?: UseIsIntersectingOptions,
) {
  const [isIntersecting, setIntersecting] = React.useState(false)

  const observer = React.useMemo(() => {
    return catchError(() => {
      const debouncedSetIntersecting = debounce(setIntersecting)
      return new IntersectionObserver(
        ([entry]) => {
          return entry.isIntersecting
            ? setIntersecting(entry.isIntersecting)
            : debouncedSetIntersecting(entry.isIntersecting)
        },
        {
          root: options?.root,
          rootMargin: options?.rootMargin,
          threshold: options?.threshold,
        },
      )
    })
  }, [options?.root, options?.rootMargin, options?.threshold])

  React.useLayoutEffect(() => {
    // stop observing when rendered
    if (isIntersecting && options?.freezeOnceVisible) return
    if (!observer) return

    if (ref.current) {
      observer.observe(ref.current)
      return () => void observer.disconnect()
    }
  }, [isIntersecting, observer, options?.freezeOnceVisible, ref])

  return isIntersecting
}
