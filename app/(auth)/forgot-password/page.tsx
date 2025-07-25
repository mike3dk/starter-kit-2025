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
import { createForgotPasswordSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAlert } from "@/lib/use-alert"
import { z } from "zod"
import { useTranslations } from "next-intl"

export default function PageForgotPassword() {
  const t = useTranslations()
  const [isPending, setIsPending] = useState(false)
  const { showAlert, showError } = useAlert()
  
  const forgotPasswordSchema = createForgotPasswordSchema(t)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsPending(true)
    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    })

    if (error) {
      showError(error.message || t("something-went-wrong"))
    } else {
      showAlert({ description: t("reset-link-sent") })
    }
    setIsPending(false)
  }

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            {t("forgot-password")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={`${t("enter-your")} ${t("email").toLowerCase()}`}
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton pending={isPending} data-testid="send-reset-link-button">
                {t("send-reset-link")}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
