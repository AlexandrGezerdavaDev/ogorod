export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"] as const

export function isSafeRedirect(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return false
  }
  if (path.startsWith("/api") || path.startsWith("/login") || path.startsWith("/signup")) {
    return false
  }
  return true
}

export function hasSessionCookie(cookieNames: string[]) {
  return cookieNames.some((name) => name.includes("session_token"))
}
