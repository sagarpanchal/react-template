export function timeSpan() {
  const start = performance.now()
  const end = () => performance.now() - start
  end.ceil = () => Math.ceil(end())
  end.round = () => Math.round(end())
  end.seconds = () => end() / 1000
  end.nanoseconds = () => end() * 1000000
  return end
}
