import { prisma } from "@/lib/prisma"

import AuthButtons from "@/components/auth-buttons"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import type { Test } from "@prisma/client"

import { getTranslations } from "next-intl/server"

export default async function Home() {
  const t = await getTranslations()
  const tests = await prisma.test.findMany()

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-lg text-gray-600">{t("description")}</p>

      {tests.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">{t("tests")}</h2>
          {tests.map((test: Test) => (
            <div key={test.id} className="mb-1 rounded border p-2">
              {test.name}
            </div>
          ))}
        </div>
      )}

      <Button className="mb-4">{t("click-me")}</Button>
      <div className="p-4">
        <AuthButtons />
      </div>
      <div className="p-4">
        <LanguageSelector />
      </div>
    </div>
  )
}
