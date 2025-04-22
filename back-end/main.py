from typing import Union
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify "http://localhost:5173" if you want to be strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
users = [{"nom": "aymane"}]

@app.get("/users")
def read_root():
    return users
