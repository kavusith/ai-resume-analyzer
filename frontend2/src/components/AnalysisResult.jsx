import SkillBadge from './SkillBadge';

export default function AnalysisResult({ result }) {
  const score = result.match_score;
  const scoreColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="result-container">
      <h2 className="result-title">📊 Analysis Results</h2>

      <div className="score-card">
        <div className="score-visual">
          <div className="score-circle" style={{ borderColor: scoreColor }}>
            <span className="score-number" style={{ color: scoreColor }}>{score.toFixed(0)}%</span>
            <span className="score-label">Match</span>
          </div>
        </div>
        <div className="score-info">
          <h3>Resume Match Score</h3>
          <p className="score-description">
            {score >= 75 ? '🎉 Excellent match! Your resume is well-aligned with this job.' :
             score >= 50 ? '👍 Good match. A few improvements could strengthen your application.' :
             '⚠️ Low match. Consider tailoring your resume for this role.'}
          </p>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${score}%`, backgroundColor: scoreColor }} />
          </div>
        </div>
      </div>

      <div className="skills-grid">
        <div className="skills-card">
          <h3>✅ Your Skills ({result.extracted_skills.length})</h3>
          <div className="badges">
            {result.extracted_skills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} type="matched" />
            ))}
          </div>
        </div>

        <div className="skills-card">
          <h3>❌ Missing Skills ({result.missing_skills.length})</h3>
          <div className="badges">
            {result.missing_skills.length > 0 ? (
              result.missing_skills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} type="missing" />
              ))
            ) : (
              <p className="no-missing">🎯 You have all required skills!</p>
            )}
          </div>
        </div>

        <div className="skills-card">
          <h3>📋 Job Requirements ({result.required_skills.length})</h3>
          <div className="badges">
            {result.required_skills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} type="neutral" />
            ))}
          </div>
        </div>
      </div>

      <div className="suggestions-card">
        <h3>💡 AI Suggestions for Improvement</h3>
        <p className="suggestions-text">{result.suggestions}</p>
      </div>

      <p className="analysis-meta">
        Analyzed: <strong>{result.filename}</strong> &nbsp;|&nbsp;
        {new Date(result.created_at).toLocaleString()}
      </p>
    </div>
  );
}