"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const SUPPORTED_LANGUAGES = ["en", "ko"]

export function LanguageSelector() {
  const [locale, setLocale] = useState("")
  const router = useRouter()

  useEffect(() => {
    const cookieLocale = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1]

    if (cookieLocale) {
      setLocale(cookieLocale)
    } else {
      const browserLocale = navigator.language.slice(0, 2)
      const validLocale = SUPPORTED_LANGUAGES.includes(browserLocale)
        ? browserLocale
        : "en"
      setLocale(validLocale)
      document.cookie = `NEXT_LOCALE=${validLocale}; path=/; max-age=31536000; SameSite=Strict`
      router.refresh()
    }
  }, [router])

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Strict`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language}
          onClick={() => changeLocale(language)}
          className={`${locale === language && "bg-green-600 text-white hover:bg-green-500"} rounded-md bg-gray-100 px-2 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-700`}
          data-testid={`language-select-${language}`}
        >
          {language}
        </button>
      ))}
    </div>
  )
}
