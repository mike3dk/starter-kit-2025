"use client"

import LoadingButton from "@/components/loading-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { resetPasswordSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useTranslations } from "next-intl"

function ResetPasswordContent() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true)
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token: searchParams.get("token")!,
    })
    if (error) {
      toast.error(`xxx => ${error.message}`)
    } else {
      toast.success(t("password-reset-success"))
      router.push("/sign-in")
    }
    setIsPending(false)
  }

  if (error === "invalid_token") {
    return (
      <div className="flex grow items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-800">
              {t("invalid-reset-link")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                {t("invalid-reset-link-message")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            {t("reset-password")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("new-password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("enter-new-password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("confirm-password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("confirm-your-new-password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={isPending}>
                {t("reset-password")}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PageResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
