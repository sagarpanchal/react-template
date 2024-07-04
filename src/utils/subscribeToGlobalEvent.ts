export function subscribeToGlobalEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.addEventListener(type, listener, options)
  return () => void window.removeEventListener(type, listener, options)
}
