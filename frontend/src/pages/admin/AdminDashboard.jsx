          import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../../api/api'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import StatusChip from '../../components/ui/StatusChip'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <Alert type="danger" message={error} />
  if (!data) return <Spinner text="جاري تحميل لوحة التحكم..." />

  const { stats, recent_donations, weekly_donations } = data.data
  const maxWeek = Math.max(...weekly_donations.map((d) => d.amount), 1)

  return (
    <>
      <h4 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2 text-primary"></i>لوحة التحكم</h4>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatCard icon="bi-cash-coin" label="إجمالي التبرعات" value={`${stats.total_donations.toLocaleString('ar-OM')} ر.ع`} color="primary" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-people" label="عدد التبرعات" value={stats.total_donation_count.toLocaleString('ar-OM')} color="success" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-heart" label="حالات نشطة" value={stats.active_cases} color="danger" link="/admin/cases" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-envelope" label="رسائل غير مقروءة" value={stats.unread_messages} color="warning" link="/admin/contacts" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-newspaper" label="أخبار منشورة" value={stats.published_news} color="info" link="/admin/news" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-calendar-event" label="فعاليات قادمة" value={stats.upcoming_events} color="secondary" link="/admin/events" /></div>
        <div className="col-6 col-lg-3"><StatCard icon="bi-hourglass-split" label="تبرعات معلقة" value={stats.pending_donations} color="warning" link="/admin/donations" /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white fw-bold">آخر التبرعات</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>المرجع</th><th>الاسم</th><th>الحالة</th><th>المبلغ</th><th>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_donations.map((d) => (
                    <tr key={d.id}>
                      <td className="text-muted font-monospace">{d.reference_number}</td>
                      <td>{d.donor_name || '—'}</td>
                      <td><StatusChip status={d.status} /></td>
                      <td className="fw-bold">{d.amount.toLocaleString('ar-OM')} ر.ع</td>
                      <td className="text-muted">{d.created_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                  {recent_donations.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-3">لا توجد تبرعات بعد</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold">التبرعات الأسبوعية</div>
            <div className="card-body">
              <div className="d-flex align-items-end justify-content-around" style={{ height: '200px' }}>
                {weekly_donations.map((d) => (
                  <div className="text-center" key={d.date} style={{ flex: 1 }}>
                    <div className="small text-primary fw-bold mb-1">{d.amount.toLocaleString('ar-OM')}</div>
                    <div className="rounded-top bg-primary mx-auto" style={{ height: `${(d.amount / maxWeek) * 160}px`, width: '28px' }}></div>
                    <div className="small text-muted mt-1">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
