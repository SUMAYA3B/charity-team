import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyDonation, confirmDemoDonation } from '../../api/api'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function DonationSuccessPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id') || ''
  const ref = params.get('ref') || ''
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const session = sessionId || ref
    if (!session) { setStatus('missing'); return }
    if (sessionId) {
      verifyDonation(sessionId)
        .then(() => setStatus('success'))
        .catch(() => setStatus('failed'))
    } else if (ref) {
      // وصلنا عبر success_url بالـ ref فقط. في وضع التطوير (local) لا يوجد
      // webhook حقيقي، لذلك نُثبت التبرع مدفوعاً في الخلفية عبر نقطة DEV-only
      // (الـ Backend يرفضها في بيئة الإنتاج). نظهر النجاح للمتبرع في الحالتين.
      confirmDemoDonation(ref).catch(() => {})
      setStatus('success')
    } else {
      setStatus('success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, ref])

  if (status === 'loading') return <div className="container py-5"><Spinner text="جاري التحقق من الدفع..." /></div>
  if (status === 'missing') return <div className="container py-5"><Alert type="warning" dismissible={false} message="معرف الدفع غير موجود." /></div>
  if (status === 'failed') return <div className="container py-5"><Alert type="danger" dismissible={false} message="تعذر تأكيد الدفعة، يرجى التحقق لاحقًا." /></div>

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 text-center" style={{ maxWidth: '520px' }}>
        <div className="card-body p-5">
          <i className="bi bi-patch-check-fill text-success display-1"></i>
          <h3 className="fw-bold mt-3">أتممت تبرعك بنجاح!</h3>
          <p className="text-muted">جزاك الله خيرًا على عطائك، لقد ساهمت في صنع الفرق.</p>
          <p className="small text-success">
            <i className="bi bi-envelope-check me-1"></i>
            سيصلك إثبات التبرع على بريدك الإلكتروني.
          </p>
          <Link to="/cases" className="btn btn-primary mt-3">تصفح المزيد من الحالات</Link>
        </div>
      </div>
    </div>
  )
}
