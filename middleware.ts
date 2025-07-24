import type { Session } from "@/lib/auth"
import { betterFetch } from "@better-fetch/fetch"
import { NextResponse, type NextRequest } from "next/server"

// Define private routes that require authentication
const privateRoutes = ["/admin", "/app"]

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname

  // Check if the current path is a private route
  const isPrivateRoute = privateRoutes.some((route) =>
    pathName.startsWith(route)
  )

  // If it's not a private route, let it through without authentication checks
  if (!isPrivateRoute) {
    return NextResponse.next()
  }

  // For private routes, check authentication
  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.BETTER_AUTH_URL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    )

    // If no session and accessing private route, redirect to sign-in
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }
  } catch (error) {
    // On auth error for private routes, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|ingredients|recipes|.*\\.png|.*\\.svg$).*)",
  ],
}
