import { prisma } from "@/lib/prisma"

import AuthButtons from "@/components/auth-buttons"
import { Button } from "@/components/ui/button"
import type { Test } from "@prisma/client"

import { getTranslations } from "next-intl/server"

export default async function Home() {
  const t = await getTranslations()
  const tests = await prisma.test.findMany()

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {t("title")}
      <div className="mb-4">
        {tests.map((test: Test) => (
          <div key={test.id}>{test.name}</div>
        ))}
      </div>
      <Button>{t("click-me")}</Button>
      <div className="p-4">
        <AuthButtons />
      </div>
      <div className="p-4"></div>
    </div>
  )
}
