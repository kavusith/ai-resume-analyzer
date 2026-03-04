import json
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.resume import ResumeAnalysis
from app.schemas.resume import AnalysisResponse, HistoryItem
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.ai_analyzer import analyze_resume

router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Read file
    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    # Extract text from PDF
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # Analyze with AI
    try:
        analysis = analyze_resume(resume_text, job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Save to database
    db_analysis = ResumeAnalysis(
        filename=file.filename,
        resume_text=resume_text,
        job_description=job_description,
        extracted_skills=json.dumps(analysis["extracted_skills"]),
        required_skills=json.dumps(analysis["required_skills"]),
        missing_skills=json.dumps(analysis["missing_skills"]),
        match_score=analysis["match_score"],
        suggestions=analysis["suggestions"]
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    return AnalysisResponse(
        id=db_analysis.id,
        filename=db_analysis.filename,
        match_score=db_analysis.match_score,
        extracted_skills=analysis["extracted_skills"],
        required_skills=analysis["required_skills"],
        missing_skills=analysis["missing_skills"],
        suggestions=analysis["suggestions"],
        created_at=db_analysis.created_at
    )

@router.get("/history", response_model=List[HistoryItem])
def get_history(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    analyses = db.query(ResumeAnalysis)\
        .order_by(ResumeAnalysis.created_at.desc())\
        .offset(skip).limit(limit).all()
    return analyses

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return AnalysisResponse(
        id=analysis.id,
        filename=analysis.filename,
        match_score=analysis.match_score,
        extracted_skills=json.loads(analysis.extracted_skills),
        required_skills=json.loads(analysis.required_skills),
        missing_skills=json.loads(analysis.missing_skills),
        suggestions=analysis.suggestions,
        created_at=analysis.created_at
    )