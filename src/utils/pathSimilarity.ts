export function pathSimilarity<T = unknown>(pathA: T[], pathB: T[]) {
  // Determine the shortest length of the two levels
  const minLength = Math.min(pathA.length, pathB.length)

  // Build the common prefix
  const slice: T[] = []
  for (let i = 0; i < minLength; i++) {
    if (pathA[i] !== pathB[i]) break // Exit the loop when indices diverge
    slice.push(pathA[i])
  }

  // Similar length
  const size = slice.length

  // Check if the two levels are equal
  const isEqual = pathA.length === pathB.length && pathB.length === size

  // A similarity score can be calculated as a ratio of the common prefix length
  // to the total length (the average of the two levels' lengths)
  const totalLengthAverage = (pathA.length + pathB.length) / 2
  const score = Number((size / totalLengthAverage).toFixed(2))

  // Return the similarity
  return { isEqual, slice, size, score }
}
