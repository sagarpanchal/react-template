export function removeUrlQueryString(url: URL) {
  // Remove the query string
  url.search = ""

  // Return the updated URL
  return url
}
