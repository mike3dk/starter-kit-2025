import asyncio

from src.utils.prisma import prisma, requires_connection


@requires_connection
async def main():
    tests = await prisma.test.find_many()
    print(tests)


if __name__ == "__main__":
    asyncio.run(main())
