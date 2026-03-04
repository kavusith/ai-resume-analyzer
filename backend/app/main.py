from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routes import resume
from app.models import resume as resume_model  # ensure model is imported

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes against job descriptions using AI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resume.router)

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}