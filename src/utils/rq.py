from typing import Any, Dict, List

from rq import Queue

from src.utils.redis import redis


def read_rq_job(job_id):
    q = Queue(connection=redis)
    job = q.fetch_job(job_id)
    if job is None:
        return {"error": "Job not found"}
    return {"id": job.id, "status": job.get_status(), "result": job.result}


def list_rq_jobs() -> Dict[str, List[Dict[str, Any]]]:
    q = Queue("default", connection=redis)  # Specify the queue name

    # Get jobs from different registries
    queued_jobs = q.get_jobs()  # Gets jobs that are queued
    started_registry = q.started_job_registry
    finished_registry = q.finished_job_registry
    failed_registry = q.failed_job_registry
    deferred_registry = q.deferred_job_registry
    scheduled_registry = q.scheduled_job_registry

    # Combine job IDs from all registries
    all_job_ids = set(job.id for job in queued_jobs)
    all_job_ids.update(started_registry.get_job_ids())
    all_job_ids.update(finished_registry.get_job_ids())
    all_job_ids.update(failed_registry.get_job_ids())
    all_job_ids.update(deferred_registry.get_job_ids())
    all_job_ids.update(scheduled_registry.get_job_ids())

    jobs_data = []
    for job_id in all_job_ids:
        job = q.fetch_job(job_id)
        if job is not None:
            jobs_data.append(
                {
                    "id": job.id,
                    "status": job.get_status(),
                    "result": job.result,
                    "enqueued_at": (
                        job.enqueued_at.isoformat() if job.enqueued_at else None
                    ),
                    "started_at": (
                        job.started_at.isoformat() if job.started_at else None
                    ),
                    "ended_at": job.ended_at.isoformat() if job.ended_at else None,
                }
            )

    # Sort jobs by enqueued_at in descending order (newest first)
    jobs_data.sort(
        key=lambda job: job["enqueued_at"] if job["enqueued_at"] is not None else "",
        reverse=True,
    )

    return {"jobs": jobs_data}
