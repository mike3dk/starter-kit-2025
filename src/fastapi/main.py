from pydantic import BaseModel

from fastapi import FastAPI

# Create a FastAPI application
app = FastAPI()


# Define a route at the root web address ("/")
@app.get("/")
def api_read_root():
    return {"message": "Hello, MealPuzzler!"}
