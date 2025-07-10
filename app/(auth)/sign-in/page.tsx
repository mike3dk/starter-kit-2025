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
import { signInSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { ErrorContext } from "@better-fetch/fetch"
import { GithubIcon } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PageSignIn() {
  const t = useTranslations()
  const router = useRouter()
  const [pendingCredentials, setPendingCredentials] = useState(false)
  const [pendingGithub, setPendingGithub] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

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
          toast.error(ctx.error.message ?? t("something-went-wrong"))
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
          toast.error(ctx.error.message ?? t("something-went-wrong"))
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
                      <FormLabel>{t(field as any)}</FormLabel>
                      <FormControl>
                        <Input
                          type={field === "password" ? "password" : "email"}
                          placeholder={`${t("enter-your")} ${t(field as any).toLowerCase()}`}
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
              <GithubIcon className="mr-2 h-4 w-4" />
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
