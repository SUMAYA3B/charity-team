import { useEffect, useState } from 'react'
import { getAdminVolunteers, updateVolunteerStatus, deleteAdminVolunteer } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'

const STATUS_LABELS = { pending: 'في الانتظار', completed: 'مكتمل' }

export default function VolunteersManagement() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = (p = page, st = status, q = query) => {
    setData(null)
    getAdminVolunteers(p, 10, { status: st, search: q })
      .then(setData)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, status, query]) // eslint-disable-line react-hooks/exhaustive-deps

  const applySearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(search.trim())
  }

  const openDetail = (v) => { setDetail(v); setShowDetail(true) }

  const changeStatus = async (id, newStatus) => {
    if (!newStatus) return
    setSaving(true)
    try {
      await updateVolunteerStatus(id, newStatus)
      setShowDetail(false)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (v) => {
    if (!confirm(`حذف طلب "${v.name}"؟`)) return
    try {
      await deleteAdminVolunteer(v.id)
      setShowDetail(false)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const badge = (val) =>
    val === 'completed'
      ? <span className="badge bg-success-subtle text-success">مكتمل</span>
      : <span className="badge bg-warning-subtle text-warning">في الانتظار</span>

  return (
    <>
      <PageHeader icon="bi-people" title="سجل المتطوعين" subtitle="طلبات التسجيل كمتطوع للتواصل مع المتقدمين ومتابعة حالاتهم" />

      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}

      <div className="d-flex flex-wrap gap-2 mb-3 px-0">
        <form onSubmit={applySearch} className="d-flex gap-2">
          <input
            type="search"
            className="form-control"
            placeholder="بحث بالاسم، البريد، الهاتف، المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: '260px' }}
          />
          <button type="submit" className="btn btn-outline-primary"><i className="bi bi-search"></i></button>
        </form>
        <select className="form-select" style={{ width: '200px' }} value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
          <option value="">كل الحالات</option>
          <option value="pending">في الانتظار</option>
          <option value="completed">مكتمل</option>
        </select>
      </div>

      {!data ? <Spinner /> : data.data.length === 0
        ? <EmptyState icon="bi-people" title="لا توجد طلبات تطوع مطابقة" />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 bg-white rounded-3">
                <thead className="table-light">
                  <tr>
                    <th>المتطوع</th>
                    <th>المدينة</th>
                    <th>الفئة العمرية</th>
                    <th>المهارات</th>
                    <th>التواصل</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th className="text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((v) => (
                    <tr key={v.id}>
                      <td className="fw-bold">{v.name}</td>
                      <td className="small">{v.city || '—'}</td>
                      <td className="small">{v.age_group || '—'}</td>
                      <td className="small text-muted" style={{ maxWidth: '220px' }}>
                        <span className="d-inline-block text-truncate" style={{ maxWidth: '220px' }}>{v.skills || '—'}</span>
                      </td>
                      <td className="small" dir="ltr">{v.phone || '—'}</td>
                      <td className="small text-muted">{v.created_at?.slice(0, 10)}</td>
                      <td>{badge(v.status)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openDetail(v)}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showDetail} title="تفاصيل المتطوع" onClose={() => setShowDetail(false)} size="lg">
        {detail && (
          <div>
            <div className="row gx-3">
              <div className="col-md-6"><p className="mb-2"><strong>الاسم:</strong> {detail.name}</p></div>
              <div className="col-md-6"><p className="mb-2"><strong>المدينة:</strong> {detail.city || '—'}</p></div>
              <div className="col-md-6"><p className="mb-2"><strong>رقم الهاتف:</strong> <span dir="ltr">{detail.phone || '—'}</span></p></div>
              <div className="col-md-6"><p className="mb-2"><strong>البريد:</strong> <span dir="ltr">{detail.email || '—'}</span></p></div>
              <div className="col-md-6"><p className="mb-2"><strong>الجنس:</strong> {detail.gender || '—'}</p></div>
              <div className="col-md-6"><p className="mb-2"><strong>الفئة العمرية:</strong> {detail.age_group || '—'}</p></div>
            </div>
            <hr />
            <p className="mb-2"><strong>المهارات أو مجالات المساهمة:</strong></p>
            <p className="text-muted">{detail.skills || 'لا شيء'}</p>
            <p className="mb-2"><strong>التوفر:</strong> {detail.availability || '—'}</p>
            {detail.notes && (
              <>
                <p className="mb-2"><strong>ملاحظات إضافية:</strong></p>
                <p className="text-muted">{detail.notes}</p>
              </>
            )}

            <div className="row g-3 mt-2">
              <div className="col-md-8">
                <label className="form-label fw-semibold">حالة الطلب</label>
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${detail.status === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                    disabled={saving || detail.status === 'completed'}
                    onClick={() => changeStatus(detail.id, 'completed')}
                  >
                    <i className="bi bi-check-lg me-1"></i>مكتمل
                  </button>
                  <button
                    className={`btn btn-sm ${detail.status === 'pending' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                    disabled={saving || detail.status === 'pending'}
                    onClick={() => changeStatus(detail.id, 'pending')}
                  >
                    <i className="bi bi-clock me-1"></i>في الانتظار
                  </button>
                </div>
              </div>
              <div className="col-md-4 d-flex flex-column justify-content-end gap-2">
                <a className="btn btn-sm btn-outline-primary" href={`mailto:${detail.email || ''}?subject=التواصل مع المتطوع - ${encodeURIComponent(detail.name)}`} target="_blank" rel="noreferrer">
                  <i className="bi bi-envelope me-1"></i>تواصل بالبريد
                </a>
                {detail.phone && (
                  <a className="btn btn-sm btn-outline-success" href={`tel:${detail.phone.replace(/\s+/g, '')}`}>
                    <i className="bi bi-telephone me-1"></i>اتصال
                  </a>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <span className="badge fs-6 bg-light text-dark">{STATUS_LABELS[detail.status]}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(detail)}>
                <i className="bi bi-trash me-1"></i>حذف الطلب
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
