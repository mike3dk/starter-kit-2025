import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
import "./globals.css"
import MicrosoftClarity from "./metrics/MicrosoftClarity"
import { AlertProvider } from "@/lib/use-alert"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages()
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <head>
        <script
          defer
          data-domain="your.com"
          src="https://plausible.starliz.com/js/script.js"
        ></script>
      </head>
      <body className="">
        <NextIntlClientProvider messages={messages}>
          <AlertProvider>
            {children}
          </AlertProvider>
        </NextIntlClientProvider>
        <MicrosoftClarity />
      </body>
    </html>
  )
}
