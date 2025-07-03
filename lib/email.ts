import nodemailer from "nodemailer"

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  timeout: 10000,
} as nodemailer.TransportOptions)

export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<EmailResult> {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error: unknown) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
