import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"

  // Apply rate limiting to all API routes
  if (pathname.startsWith("/api")) {
    const limiter = await rateLimit(ip)
    if (!limiter.success) {
      return NextResponse.json(
        { error: limiter.error },
        { status: 429 }
      )
    }
  }

  // Public routes
  const publicRoutes = ["/", "/login", "/signup", "/jobs"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Auth routes
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url))
    }
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect recruiter routes
  if (pathname.startsWith("/recruiter") && userRole !== "RECRUITER") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Protect applicant dashboard
  if (pathname.startsWith("/dashboard") && userRole !== "APPLICANT") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Require auth for protected routes
  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
}
