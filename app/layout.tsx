import type { Metadata } from "next"
import "./globals.css"
import MicrosoftClarity from "./metrics/MicrosoftClarity"

export const metadata: Metadata = {
  title: "your website",
  description: "your description to your website",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="your.com"
          src="https://plausible.starliz.com/js/script.js"
        ></script>
      </head>
      <body className="">
        {children}
        <MicrosoftClarity />
      </body>
    </html>
  )
}
