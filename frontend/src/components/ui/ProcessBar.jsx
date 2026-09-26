import { fmt } from '../../utils/format'

export default function ProcessBar({ percentage }) {
  const pct = Math.min(100, Math.max(0, parseFloat(percentage) || 0))
  return (
    <div className="progress" style={{ height: '10px' }}>
      <div
        className={`progress-bar ${pct >= 100 ? 'bg-success' : 'bg-primary'}`}
        role="progressbar"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {fmt(pct)}%
      </div>
    </div>
  )
}
