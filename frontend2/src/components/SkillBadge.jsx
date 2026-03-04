export default function SkillBadge({ skill, type }) {
  const colors = {
    matched: 'badge-green',
    missing: 'badge-red',
    neutral: 'badge-blue',
  };
  return (
    <span className={`badge ${colors[type] || 'badge-blue'}`}>
      {type === 'matched' && '✓ '}
      {type === 'missing' && '✗ '}
      {skill}
    </span>
  );
}