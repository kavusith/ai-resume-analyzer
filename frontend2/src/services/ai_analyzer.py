import json
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.OPENAI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def analyze_resume(resume_text: str, job_description: str) -> dict:
    prompt = f"""
You are an expert HR recruiter and ATS system.
Analyze the resume against the job description and return ONLY a JSON object.

RESUME:
{resume_text[:3000]}

JOB DESCRIPTION:
{job_description[:2000]}

Return ONLY this JSON structure:
{{
  "extracted_skills": ["skill1", "skill2"],
  "required_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "match_score": 75.5,
  "suggestions": "Detailed suggestions here..."
}}

Return ONLY the JSON. No extra text. No markdown.
"""
    response = model.generate_content(prompt)
    result_text = response.text.strip()

    if result_text.startswith("```json"):
        result_text = result_text[7:]
    if result_text.startswith("```"):
        result_text = result_text[3:]
    if result_text.endswith("```"):
        result_text = result_text[:-3]

    return json.loads(result_text.strip())