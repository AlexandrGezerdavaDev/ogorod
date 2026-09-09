import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_ROUTES, hasSessionCookie, isSafeRedirect } from "@/features/auth/constants"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isLoggedIn = hasSessionCookie(request.cookies.getAll().map((cookie) => cookie.name))
  const isAuthRoute = AUTH_ROUTES.includes(
    pathname as (typeof AUTH_ROUTES)[number]
  )
  const isApi = pathname.startsWith("/api/")

  if (!isLoggedIn && isApi) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    if (pathname !== "/" && isSafeRedirect(pathname)) {
      loginUrl.searchParams.set("from", pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/plants/:path*",
    "/scan/:path*",
    "/calendar/:path*",
    "/seeds/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/api/auth/:path*",
    "/api/sync/:path*",
    "/api/kb/:path*",
    "/api/geo/:path*",
    "/api/weather",
  ],
}
