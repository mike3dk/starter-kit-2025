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
import { signUpSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useTranslations } from "next-intl"

export default function PageSignUp() {
  const t = useTranslations()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true)
        },
        onSuccess: () => {
          toast(t("account-created-verify-email"))
        },
        onError: (ctx) => {
          console.log("error", ctx)
          toast.error(ctx.error.message ?? t("something-went-wrong"))
        },
      }
    )
    setPending(false)
  }

  const getFieldLabel = (field: string) => {
    switch (field) {
      case "confirmPassword":
        return t("confirm-password")
      default:
        return t(field as any)
    }
  }

  const getFieldPlaceholder = (field: string) => {
    switch (field) {
      case "confirmPassword":
        return t("confirm-your-new-password")
      default:
        return `${t("enter-your")} ${t(field as any).toLowerCase()}`
    }
  }

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            {t("create-account")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{getFieldLabel(field)}</FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("assword")
                              ? "password"
                              : field === "email"
                                ? "email"
                                : "text"
                          }
                          placeholder={getFieldPlaceholder(field)}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={pending}>{t("sign-up")}</LoadingButton>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href="/sign-in" className="text-primary hover:underline">
              {t("already-have-account")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
