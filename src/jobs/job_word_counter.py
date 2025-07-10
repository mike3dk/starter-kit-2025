import httpx
from rq import Queue

from src.utils.redis import redis

q = Queue(connection=redis)


def count_words_at_url(url):
    resp = httpx.get(url)
    return len(resp.text.split())


def submit_count_words_job(url):
    return q.enqueue(count_words_at_url, url)
