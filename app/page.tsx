import { prisma } from '@/lib/prisma'
import type { Test } from "@prisma/client"

export default async function Home() {
  const tests = await prisma.test.findMany();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      starter kit

      <div>
        {tests.map((test: Test) => (
          <div key={test.id}>{test.name}</div>
        ))}
      </div>
    </div>
  );
}
