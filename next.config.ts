import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const isDev = process.env.NODE_ENV !== "production"

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.starliz.com https://www.clarity.ms https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  // Different connect-src for dev vs production
  isDev
    ? "connect-src 'self' http://localhost:3000 ws://localhost:3000 https://fastapi.mealpuzzler.com https://plausible.starliz.com"
    : "connect-src 'self' https://fastapi.mealpuzzler.com https://plausible.starliz.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

const nextConfig: NextConfig = {
  output: "standalone",
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: cspHeader,
        },
      ],
    },
  ],
}

export default withNextIntl(nextConfig)
