export function removeUrlHash(url: URL) {
  // Remove the hash
  url.hash = ""

  // Return the updated URL
  return url
}
