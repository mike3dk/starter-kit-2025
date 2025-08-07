from pydantic import BaseModel

from fastapi import FastAPI
from src.jobs.job_word_counter import submit_count_words_job
from src.utils.rq import list_rq_jobs

# Create a FastAPI application
app = FastAPI()


# Define the request model
class URLRequest(BaseModel):
    url: str


# Define a route at the root web address ("/")
@app.get("/")
def api_read_root():
    return {"message": "Hello, Starter Kit 2025!"}


@app.post("/rqjobs")
def create_rq_job(request: URLRequest):
    job = submit_count_words_job(request.url)
    return {
        "job_id": job.id,
        "status": "success",
        "message": "Job submitted successfully",
    }


@app.get("/rqjobs")
def api_list_rq_jobs():
    jobs = list_rq_jobs()
    return jobs
