import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth(async (req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"

  // Global API Rate Limiting
  if (nextUrl.pathname.startsWith("/api")) {
    const { checkRateLimit } = await import("@/lib/rate-limit")
    const limiter = await checkRateLimit(ip, "api")
    if (!limiter.success) {
      return NextResponse.json(
        { error: limiter.error },
        { status: 429 }
      )
    }
  }
  
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/signup")
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || 
                          nextUrl.pathname.startsWith("/recruiter")
  
  const isRecruiterRoute = nextUrl.pathname.startsWith("/recruiter")

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isRecruiterRoute && req.auth?.user?.role !== "RECRUITER") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
