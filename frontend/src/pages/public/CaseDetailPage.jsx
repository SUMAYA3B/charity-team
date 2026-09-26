import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCaseBySlug } from '../../api/api'
import ProcessBar from '../../components/ui/ProcessBar'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'

export default function CaseDetailPage() {
  const { slug } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    getCaseBySlug(slug)
      .then((res) => setCaseData(res.data))
      .catch(() => setError('لم يتم العثور على الحالة'))
  }, [slug])

  if (error) return <div className="container my-5"><EmptyState icon="bi-search" title="غير موجود" description={error} /></div>
  if (!caseData) return <Spinner text="جاري تحميل الحالة..." />

  const canReceive = caseData.status !== 'completed'

  return (
    <div className="container py-5">
      <nav className="mb-3 small">
        <Link to="/cases" className="text-decoration-none">حالات التبرع</Link> / <span className="text-muted">{caseData.title}</span>
      </nav>

      <div className="row g-4">
        <div className="col-lg-8">
          {caseData.featured_image && (
            <img src={caseData.featured_image} alt={caseData.title} className="img-fluid rounded-3 w-100 mb-4" style={{ maxHeight: '420px', objectFit: 'cover' }} />
          )}
          <h2 className="fw-bold">{caseData.title}</h2>
          {caseData.summary && <p className="lead text-muted">{caseData.summary}</p>}
          <div dangerouslySetInnerHTML={{ __html: caseData.description }} />

          {caseData.images && caseData.images.length > 0 && (
            <div className="row g-2 mt-3">
              {caseData.images.map((img) => (
                <div className="col-4 col-md-3" key={img.id}>
                  <img src={img.path} alt="" className="img-fluid rounded" style={{ height: '120px', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">تم جمع</span>
                <span className="badge bg-primary-subtle text-primary">{caseData.completion_percentage}%</span>
              </div>
              <h3 className="fw-bold text-primary">{caseData.collected_amount.toLocaleString('ar-OM')} ر.ع</h3>
              <div className="text-muted mb-3">الهدف: {caseData.target_amount.toLocaleString('ar-OM')} ر.ع</div>
              <ProcessBar percentage={caseData.completion_percentage} />

              {caseData.days_left !== null && caseData.days_left !== undefined && caseData.status !== 'completed' && (
                <div className="text-muted small mt-3">
                  <i className="bi bi-hourglass-split me-1"></i>
                  المتبقي {caseData.days_left} يوم
                </div>
              )}

              {canReceive ? (
                <div className="mt-4">
                  <label className="form-label fw-bold">مبلغ التبرع (ر.ع)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-lg mb-3"
                    placeholder="أدخل المبلغ"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Link
                    to={`/donate?case=${caseData.id}&amount=${amount || ''}`}
                    className="btn btn-primary w-100 btn-lg"
                  >
                    <i className="bi bi-gift me-2"></i>تبرع الآن
                  </Link>
                </div>
              ) : (
                <Alert type="success" dismissible={false} message="تم إكمال الحالة بنجاح، شكرًا لمساهمتكم." />
              )}

              {caseData.donors_count > 0 && (
                <div className="text-center text-muted small mt-3">
                  <i className="bi bi-people me-1"></i>{caseData.donors_count} تبرع لهذه الحالة
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
