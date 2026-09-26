import { useEffect, useState } from 'react'
import { getAdminContacts, markContactRead, deleteAdminContact } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

export default function ContactsManagement() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const load = () => {
    setData(null)
    getAdminContacts(page, 10, status).then(setData).catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, status])

  const openDetail = async (m) => {
    setDetail(m)
    setShowDetail(true)
    if (!m.is_read) {
      try {
        await markContactRead(m.id)
        load()
      } catch (e) { /* ignore */ }
    }
  }

  const handleDelete = async (m) => {
    if (!confirm('حذف هذه الرسالة؟')) return
    try { await deleteAdminContact(m.id); setShowDetail(false); load() } catch (e) { setError(e.message) }
  }

  return (
    <>
      <PageHeader icon="bi-envelope" title="رسائل التواصل" subtitle="رسائل الزوار المرسلة عبر نموذج التواصل" />

      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}

      <div className="col-md-3 mb-3 px-0">
        <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
          <option value="">كل الرسائل</option>
          <option value="unread">غير مقروءة</option>
          <option value="read">مقروءة</option>
        </select>
      </div>

      {!data ? <Spinner /> : data.data.length === 0 ? <EmptyState icon="bi-envelope" title="لا توجد رسائل" />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 bg-white rounded-3">
                <thead className="table-light">
                  <tr><th>المرسل</th><th>الموضوع</th><th>البريد</th><th>التاريخ</th><th>الحالة</th><th className="text-end">إجراءات</th></tr>
                </thead>
                <tbody>
                  {data.data.map((m) => (
                    <tr key={m.id} className={m.is_read ? '' : 'table-warning'}>
                      <td className="fw-bold">{m.name}</td>
                      <td>{m.subject}</td>
                      <td className="text-muted small" dir="ltr">{m.email}</td>
                      <td className="text-muted small">{m.created_at?.slice(0, 10)}</td>
                      <td>{m.is_read ? <span className="badge bg-success-subtle text-success">مقروءة</span> : <span className="badge bg-warning-subtle text-warning">جديدة</span>}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openDetail(m)}><i className="bi bi-eye"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showDetail} title="تفاصيل الرسالة" onClose={() => setShowDetail(false)}>
        {detail && (
          <div>
            <p className="mb-1"><strong>الاسم:</strong> {detail.name}</p>
            <p className="mb-1"><strong>البريد:</strong> <span dir="ltr" className="text-start">{detail.email}</span></p>
            {detail.phone && <p className="mb-1"><strong>الهاتف:</strong> <span dir="ltr">{detail.phone}</span></p>}
            <p className="mb-1"><strong>الموضوع:</strong> {detail.subject}</p>
            <hr />
            <p className="mb-0">{detail.message}</p>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-outline-danger" onClick={() => handleDelete(detail)}>
                <i className="bi bi-trash me-1"></i>حذف
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
