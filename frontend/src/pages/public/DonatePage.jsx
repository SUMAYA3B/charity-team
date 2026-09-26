import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createDonationSession, getCases } from '../../api/api'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function DonatePage() {
  const [params] = useSearchParams()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const preselectCase = params.get('case') || ''
  const presetAmount = params.get('amount') || ''

  const [form, setForm] = useState({
    donation_case_id: preselectCase,
    amount: presetAmount,
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    donor_type: 'general',
  })

  useEffect(() => {
    getCases(1, 100)
      .then((res) => setCases(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setForm((f) => ({ ...f, donation_case_id: preselectCase, amount: presetAmount }))
  }, [preselectCase, presetAmount])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(null)
    setSubmitting(true)
    try {
      const res = await createDonationSession({
        ...form,
        amount: form.amount ? Number(form.amount) : undefined,
        donation_case_id: form.donation_case_id ? Number(form.donation_case_id) : null,
      })
      setSuccess({ sessionId: res.data.session_id, url: res.data.payment_url })
      // توجيه المستخدم مباشرة إلى بوابة الدفع الآمنة
      if (res.data.payment_url) {
        window.location.assign(res.data.payment_url)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container py-5"><Spinner text="جاري تحميل البيانات..." /></div>

  return (
    <div className="container py-5" style={{ maxWidth: '760px' }}>
      <div className="text-center mb-4">
        <i className="bi bi-gift text-primary display-4"></i>
        <h2 className="fw-bold mt-2">ساهم في عمل الخير</h2>
        <p className="text-muted">املأ بياناتك للانتقال إلى بوابة الدفع الآمنة</p>
      </div>

      {success ? (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center p-4">
            <i className="bi bi-check-circle-fill text-success display-3"></i>
            <h4 className="fw-bold mt-3">تم تجهيز جلسة الدفع</h4>
            <p className="text-muted">اضغط الزر أدناه لإتمام التبرع عبر بوابة ثواني الآمنة</p>
            <a href={success.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-box-arrow-up-right me-2"></i>الانتقال إلى بوابة الدفع
            </a>
            <div className="text-muted small mt-3">
              رقم مرجع التبرع: <strong>{success.sessionId}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
            <form onSubmit={handleSubmit}>
              <div className="text-muted small fw-bold mb-3">بيانات التبرع</div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">إلى حساب تبرع (اختياري)</label>
                  <select className="form-select" name="donation_case_id" value={form.donation_case_id} onChange={handleChange}>
                    <option value="">تبرع عام</option>
                    {cases.filter((c) => c.status !== 'completed').map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">المبلغ (ر.ع) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    min="1"
                    required
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="مثال: 50"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">الاسم الكامل</label>
                  <input type="text" className="form-control" name="donor_name" value={form.donor_name} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input type="email" className="form-control" name="donor_email" value={form.donor_email} onChange={handleChange} dir="ltr" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">رقم الهاتف</label>
                  <input type="tel" className="form-control" name="donor_phone" value={form.donor_phone} onChange={handleChange} dir="ltr" placeholder="9XXXXXXXX" />
                </div>
                <div className="col-12 text-muted small">
                  <i className="bi bi-shield-check me-1 text-success"></i>
                  عملية الدفع تتم عبر بوابة ثواني الآمنة، لن نقوم بحفظ بيانات بطاقتك.
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary btn-lg px-5" disabled={submitting}>
                    {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>جاري التجهيز...</> : <><i className="bi bi-gift me-2"></i>متابعة إلى الدفع</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
