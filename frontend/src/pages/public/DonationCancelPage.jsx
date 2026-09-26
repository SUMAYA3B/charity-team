import { Link } from 'react-router-dom'

export default function DonationCancelPage() {
  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 text-center" style={{ maxWidth: '520px' }}>
        <div className="card-body p-5">
          <i className="bi bi-x-circle text-warning display-1"></i>
          <h3 className="fw-bold mt-3">تم إلغاء الدفع</h3>
          <p className="text-muted">لم يتم إتمام التبرع. يمكنك المحاولة مرة أخرى في أي وقت.</p>
          <Link to="/donate" className="btn btn-primary mt-3 me-2">إعادة المحاولة</Link>
          <Link to="/cases" className="btn btn-outline-primary mt-3">تصفح الحالات</Link>
        </div>
      </div>
    </div>
  )
}
