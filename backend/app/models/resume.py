from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    resume_text = Column(Text)
    job_description = Column(Text)
    extracted_skills = Column(Text)       # JSON string
    required_skills = Column(Text)        # JSON string
    missing_skills = Column(Text)         # JSON string
    match_score = Column(Float)
    suggestions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())