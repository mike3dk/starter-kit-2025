import { prisma } from "@/lib/prisma"
import type { Test } from "@prisma/client"
import { Button } from "@/components/ui/button"
import AuthButtons from "@/components/auth-buttons"

export default async function Home() {
  const tests = await prisma.test.findMany()

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      starter kit
      <div className="mb-4">
        {tests.map((test: Test) => (
          <div key={test.id}>{test.name}</div>
        ))}
      </div>
      <Button>Click me!</Button>
      <div className="p-4">
        <AuthButtons />
      </div>
    </div>
  )
}
