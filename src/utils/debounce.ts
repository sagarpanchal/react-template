type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => any>(callback: T, delay = 0): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | undefined

  const debounced: DebouncedFunction<T> = function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => void callback(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timeoutId)

  return debounced
}
