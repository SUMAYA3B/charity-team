import { useEffect, useState } from 'react'
import { getAdminDonations, getDonationsSummary, getDonation } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import StatusChip from '../../components/ui/StatusChip'
import Modal from '../../components/ui/Modal'
import { fmt } from '../../utils/format'

export default function DonationsManagement() {
  const [data, setData] = useState(null)
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const load = () => {
    setData(null)
    getAdminDonations(page, 10, { search, status })
      .then(setData)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, search, status])

  useEffect(() => {
    getDonationsSummary().then(setSummary).catch(() => {})
  }, [])

  const openDetail = async (reference) => {
    try { setDetail((await getDonation(reference)).data); setShowDetail(true) } catch (e) { setError(e.message) }
  }

  return (
    <>
      <PageHeader icon="bi-cash-coin" title="التبرعات" subtitle="عرض وإدارة جميع التبرعات" />

      {summary && (
        <div className="row g-3 mb-4">
                    <div className="col-md-3"><div className="border rounded-3 p-3 bg-white shadow-sm"><div className="text-muted small">الإجمالي</div><div className="fw-bold fs-4 text-primary">{fmt(summary.total_amount)} ر.ع</div></div></div>
          <div className="col-md-3"><div className="border rounded-3 p-3 bg-white shadow-sm"><div className="text-muted small">عدد التبرعات</div><div className="fw-bold fs-4">{fmt(summary.total_count)}</div></div></div>
          <div className="col-md-3"><div className="border rounded-3 p-3 bg-white shadow-sm"><div className="text-muted small">مكتملة</div><div className="fw-bold fs-4 text-success">{fmt(summary.paid_count)}</div></div></div>
          <div className="col-md-3"><div className="border rounded-3 p-3 bg-white shadow-sm"><div className="text-muted small">معلقة</div><div className="fw-bold fs-4 text-warning">{fmt(summary.pending_count)}</div></div></div>
        </div>
      )}

      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="ابحث بالاسم أو المرجع..."
              value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
            <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
            <option value="">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="processing">قيد المعالجة</option>
            <option value="paid">مكتمل</option>
            <option value="failed">فشل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {!data ? <Spinner /> : data.data.length === 0 ? <EmptyState icon="bi-cash-coin" title="لا توجد تبرعات" />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 bg-white rounded-3">
                <thead className="table-light">
                  <tr><th>المرجع</th><th>الاسم</th><th>الحالة</th><th>المبلغ</th><th>التاريخ</th><th className="text-end">عرض</th></tr>
                </thead>
                <tbody>
                  {data.data.map((d) => (
                    <tr key={d.id}>
                      <td className="text-muted font-monospace small">{d.reference_number}</td>
                      <td className="fw-bold">{d.donor_name || '—'}</td>
                      <td><StatusChip status={d.status} /></td>
                      <td className="fw-bold">{fmt(d.amount)} ر.ع</td>
                      <td className="text-muted small">{d.created_at?.slice(0, 10)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openDetail(d.reference_number)}><i className="bi bi-eye"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showDetail} title="تفاصيل التبرع" onClose={() => setShowDetail(false)}>
        {detail && (
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <tbody>
                <tr><th className="text-muted">رقم المرجع</th><td className="font-monospace">{detail.reference_number}</td></tr>
                <tr><th className="text-muted">الاسم</th><td>{detail.donor_name || '—'}</td></tr>
                <tr><th className="text-muted">البريد</th><td dir="ltr" className="text-start">{detail.donor_email || '—'}</td></tr>
                <tr><th className="text-muted">الهاتف</th><td dir="ltr" className="text-start">{detail.donor_phone || '—'}</td></tr>
                <tr><th className="text-muted">الحالة</th><td><StatusChip status={detail.status} /></td></tr>
                <tr><th className="text-muted">المبلغ</th><td className="fw-bold">{fmt(detail.amount)} ر.ع</td></tr>
                <tr><th className="text-muted">نوع المتبرع</th><td>{detail.donor_type}</td></tr>
                <tr><th className="text-muted">إلى</th><td>{detail.donation_case?.title || 'تبرع عام'}</td></tr>
                <tr><th className="text-muted">تاريخ الإنشاء</th><td>{detail.created_at}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </>
  )
}
