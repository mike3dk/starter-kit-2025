"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import LoadingButton from "@/components/loading-button"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function SignoutButton() {
  const t = useTranslations()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleSignOut = async () => {
    try {
      setPending(true)
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
            router.refresh()
          },
        },
      })
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setPending(false)
    }
  }

  return (
    <LoadingButton pending={pending} onClick={handleSignOut}>
      {t("sign-out")}
    </LoadingButton>
  )
}
