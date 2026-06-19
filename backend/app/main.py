from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import Base, engine
from app.api import auth, trips, weather, expenses
import app.models.models  # ensure models are loaded

Base.metadata.create_all(bind=engine)

app = FastAPI(title="YatraAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(weather.router)
app.include_router(expenses.router)

@app.get("/")
def root():
    return {"message": "YatraAI API is running"}
