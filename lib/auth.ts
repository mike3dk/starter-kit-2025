import { betterAuth, BetterAuthOptions } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url, token }) => {
  //     console.log("Sending verification email to", user.email)
  //     console.log("Verification URL:", url)
  //     console.log("Verification token:", token)

  //     const verficationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/
  //       verify-email?token=${token}&callbackUrl=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`
  //   },
  // },
  trustedOrigins: [
    "https://mealpuzzler.lisa7h.com",
    "https://mealpuzzler.lisa7h.com/api/auth",
    "https://0.0.0.0:4027",
  ],
} satisfies BetterAuthOptions)
