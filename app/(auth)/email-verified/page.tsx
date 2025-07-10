import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function PageEmailVerified() {
  const t = await getTranslations()

  return (
    <div className="flex grow flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">
        {t("email-verified")}
      </h1>
      <p className="mb-4 text-gray-600">{t("email-verified-message")}</p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
        })}
      >
        {t("go-to-home")}
      </Link>
    </div>
  )
}
