import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
//   return Response.json({ message: "Hello, world!" }, { status: 200 })

  // the bottom code worked, blocking it for security reasons
  const body = await req.json()
  const { to, subject, message } = body

  const result = await sendEmail({ to, subject, text: message, html: message })

  if (result.error) {
    return Response.json({ error: result.error }, { status: 500 })
  }

  return Response.json(
    { message: "Email sent successfully", messageId: result.messageId },
    { status: 200 }
  )
}
