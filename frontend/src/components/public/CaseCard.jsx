import { Link } from 'react-router-dom'
import ProcessBar from '../ui/ProcessBar'
import { fmt } from '../../utils/format'

export default function CaseCard({ item }) {
  const pct = item.completion_percentage ?? 0

  return (
    <div className="card case-card h-100 shadow-sm border-0 overflow-hidden">
      <div className="position-relative">
        {item.featured_image ? (
          <img src={item.featured_image} alt={item.title} className="card-img-top case-image" loading="lazy" />
        ) : (
          <div className="case-image-placeholder d-flex align-items-center justify-content-center">
            <i className="bi bi-heart-pulse text-primary display-3"></i>
          </div>
        )}
        <span className={`badge position-absolute top-0 start-0 m-2 ${item.status === 'completed' ? 'bg-success' : 'bg-primary'}`}>
          {item.status === 'completed' ? 'مكتمل' : 'نشط'}
        </span>
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold">
          <Link to={`/cases/${item.slug}`} className="text-decoration-none text-dark">{item.title}</Link>
        </h5>
        {item.summary && <p className="card-text text-muted small text-truncate">{item.summary}</p>}
        <ProcessBar percentage={pct} />
        <div className="d-flex justify-content-between mt-2 small flex-wrap gap-1">
          <div>
            <span className="text-primary fw-bold">{fmt(item.collected_amount)}</span> ر.ع
            <span className="text-muted"> / {fmt(item.target_amount)} ر.ع</span>
          </div>
          <div className="text-muted">{fmt(pct)}%</div>
        </div>
        {item.days_left !== null && item.days_left !== undefined && item.status !== 'completed' && (
          <div className="text-muted small mt-2">
            <i className="bi bi-hourglass-split me-1"></i>
            {item.days_left > 0 ? `المتبقي ${fmt(item.days_left)} يوم` : 'ينتهي قريبًا'}
          </div>
        )}
      </div>
      <div className="card-footer bg-white border-0 p-3 pt-0">
        <Link to={`/cases/${item.slug}`} className="btn btn-outline-primary w-100">
          التفاصيل والتبرع <i className="bi bi-arrow-left"></i>
        </Link>
      </div>
    </div>
  )
}
