type Callback<T> = (...args: any[]) => T
type ErrorCallback<T> = (error?: any) => T

export function catchError<FR = undefined, ER = undefined>(func?: Callback<FR>, onError?: ErrorCallback<ER>): FR | ER

export function catchError(func?: any, onError?: any): any {
  const handleError = (error: any) => {
    console.error(error)
    return onError?.(error)
  }

  try {
    const output = func?.()
    if (output?.constructor?.name !== "Promise") return output
    return output?.catch?.(handleError)
  } catch (error) {
    return handleError(error)
  }
}
