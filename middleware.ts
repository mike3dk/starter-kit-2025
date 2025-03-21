import type { Session } from "@/lib/auth"
import { betterFetch } from "@better-fetch/fetch"
import { NextResponse, type NextRequest } from "next/server"

const authRoutes = ["/sign-in", "/sign-up"]
const passwordRoutes = ["/reset-password", "/forgot-password"]
const adminRoutes = ["/admin"]

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname

  console.log("Request Path:", pathName)
  const isAuthRoute = authRoutes.includes(pathName)
  const isPasswordRoute = passwordRoutes.includes(pathName)
  const isAdminRoute = adminRoutes.includes(pathName)

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

    console.log("Session Data:", JSON.stringify(session, null, 2))

    if (!session) {
      console.log("No session found, redirecting to sign-in")
      if (isAuthRoute || isPasswordRoute) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    console.log("User Data:", JSON.stringify(session?.user, null, 2))
    if (isAdminRoute) {
      if (!session?.user?.role || session.user.role.toLowerCase() !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|ingredients|recipes|.*\\.png|.*\\.svg$).*)",
  ],
}
