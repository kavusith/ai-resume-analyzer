from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routes import resume
from app.models import resume as resume_model

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Analyzer API", version="1.0.0")

# Fix CORS
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}