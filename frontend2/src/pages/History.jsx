import { useEffect, useState } from 'react';
import { getHistory } from '../services/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) =>
    score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="history-page">
      <h1>📋 Analysis History</h1>
      {loading ? (
        <div className="loading-state">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <p>No analyses yet. <a href="/">Analyze your first resume!</a></p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-header">
                <span className="history-filename">📄 {item.filename}</span>
                <span className="history-score" style={{ color: scoreColor(item.match_score) }}>
                  {item.match_score.toFixed(0)}%
                </span>
              </div>
              <div className="history-bar">
                <div className="history-fill" style={{ width: `${item.match_score}%`, backgroundColor: scoreColor(item.match_score) }} />
              </div>
              <p className="history-date">{new Date(item.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}