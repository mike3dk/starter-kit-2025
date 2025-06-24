from prisma import Client

prisma = Client()


def requires_connection(func):
    async def wrapper(*args, **kwargs):
        if not prisma.is_connected():
            await prisma.connect()
        return await func(*args, **kwargs)

    return wrapper
