export function popUrlPathSegment(url: URL) {
  // Get the pathname, split it into segments, and remove the last segment if there is more than one
  const pathSegments = url.pathname.split("/").filter(Boolean)
  if (pathSegments.length > 0) {
    pathSegments.pop() // Remove the last segment
    url.pathname = pathSegments.length > 0 ? `/${pathSegments.join("/")}` : ""
  }

  // Return the updated URL
  return url
}
