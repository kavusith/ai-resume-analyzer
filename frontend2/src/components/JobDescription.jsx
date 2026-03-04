export default function JobDescription({ value, onChange }) {
  return (
    <div className="jd-section">
      <label className="section-label">💼 Job Description</label>
      <textarea
        className="jd-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={10}
      />
      <small className="char-count">{value.length} characters</small>
    </div>
  );
}