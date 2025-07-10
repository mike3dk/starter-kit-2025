import os

import redis as redis_client

redis = None


def init_redis():
    try:
        global redis  # pylint: disable=W0603,C0103
        redis = redis_client.from_url(os.environ.get("REDIS_URL"))
        if not redis:
            raise ConnectionError(
                "Failed to initialize Redis - REDIS_URL environment variable not set"
            )

    except Exception as e:  # pylint: disable=W0703
        raise ConnectionError(f"Failed to initialize Redis connection: {str(e)}") from e


init_redis()
