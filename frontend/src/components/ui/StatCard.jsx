import { Link } from 'react-router-dom'

export default function StatCard({ icon, label, value, color = 'primary', link }) {
  const inner = (
    <div className="stat-card h-100">
      <div className="d-flex align-items-center gap-3">
        <div className={`stat-icon bg-${color}-subtle text-${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div className="flex-grow-1">
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  )

  if (link) return <Link to={link} className="text-decoration-none">{inner}</Link>
  return inner
}
