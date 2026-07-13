from fastapi import FastAPI
from .database import engine, Base
from .routers import auth

app = FastAPI(title="LogPulse API")

app.include_router(auth.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "LogPulse API"}
