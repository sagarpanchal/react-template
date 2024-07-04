export function combineUrl(...urls: (string | undefined)[]) {
  const output = urls.reduce((acc, url) => {
    if (!acc) return url
    if (!url) return acc
    return `${acc.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
  })

  return output ?? ""
}
