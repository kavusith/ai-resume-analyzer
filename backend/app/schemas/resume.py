from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnalysisResponse(BaseModel):
    id: int
    filename: str
    match_score: float
    extracted_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    suggestions: str
    created_at: datetime

    class Config:
        from_attributes = True

class HistoryItem(BaseModel):
    id: int
    filename: str
    match_score: float
    created_at: datetime

    class Config:
        from_attributes = True