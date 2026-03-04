import { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescription from '../components/JobDescription';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeResume } from '../services/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload a resume PDF.');
    if (!jobDesc.trim()) return setError('Please enter a job description.');
    setError('');
    setLoading(true);
    try {
      const data = await analyzeResume(file, jobDesc);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDesc('');
    setResult(null);
    setError('');
  };

  return (
    <div className="home-page">
      {!result ? (
        <div className="analyzer-card">
          <div className="card-header">
            <h1>AI Resume Analyzer</h1>
            <p>Upload your resume and paste a job description to get an instant match score.</p>
          </div>
          <ResumeUpload onFileSelect={setFile} file={file} />
          <JobDescription value={jobDesc} onChange={setJobDesc} />
          {error && <div className="error-banner">⚠️ {error}</div>}
          <button
            className={`analyze-btn ${loading ? 'loading' : ''}`}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Analyzing with AI...</> : '🚀 Analyze Resume'}
          </button>
        </div>
      ) : (
        <div>
          <AnalysisResult result={result} />
          <button className="reset-btn" onClick={handleReset}>← Analyze Another Resume</button>
        </div>
      )}
    </div>
  );
}