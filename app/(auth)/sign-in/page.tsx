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
import { createSignInSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAlert } from "@/lib/use-alert"

import { ErrorContext } from "@better-fetch/fetch"
import { Github } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PageSignIn() {
  const t = useTranslations()
  const router = useRouter()
  const [pendingCredentials, setPendingCredentials] = useState(false)
  const [pendingGithub, setPendingGithub] = useState(false)
  const { showError, showSuccess } = useAlert()
  
  const signInSchema = createSignInSchema(t)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleResendVerification = async (email: string) => {
    try {
      await authClient.sendVerificationEmail({ email })
      showSuccess(t("verification-email-sent"))
    } catch {
      showError(t("failed-to-send-verification"))
    }
  }

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPendingCredentials(true)
        },
        onSuccess: async () => {
          router.push("/")
          router.refresh()
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx)
          const isEmailNotVerified = ctx.error.message?.toLowerCase().includes("not verified") || 
                                   ctx.error.message?.toLowerCase().includes("email is not verified")
          
          if (isEmailNotVerified) {
            showError(ctx.error.message ?? t("something-went-wrong"), {
              secondaryActionText: t("resend-verification-email"),
              onSecondaryAction: () => handleResendVerification(values.email)
            })
          } else {
            showError(ctx.error.message ?? t("something-went-wrong"))
          }
        },
      }
    )
    setPendingCredentials(false)
  }

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setPendingGithub(true)
        },
        onSuccess: async () => {
          router.push("/")
          router.refresh()
        },
        onError: (ctx: ErrorContext) => {
          showError(ctx.error.message ?? t("something-went-wrong"))
        },
      }
    )
    setPendingGithub(false)
  }

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            {t("sign-in")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              {["email", "password"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signInSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>{t(field as string)}</FormLabel>
                      <FormControl>
                        <Input
                          type={field === "password" ? "password" : "email"}
                          placeholder={`${t("enter-your")} ${t(field as string).toLowerCase()}`}
                          {...fieldProps}
                          autoComplete={
                            field === "password" ? "current-password" : "email"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={pendingCredentials}>
                {t("sign-in")}
              </LoadingButton>
            </form>
          </Form>
          <div className="mt-4">
            <LoadingButton
              pending={pendingGithub}
              onClick={handleSignInWithGithub}
            >
              <Github className="mr-2 h-4 w-4" />
              {t("continue-with-github")}
            </LoadingButton>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              {t("forgot-password-question")}
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            {t("dont-have-account")}{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline"
            >
              {t("sign-up")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
