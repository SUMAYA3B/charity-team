import { useEffect, useState } from 'react'
import { getAdminEvents, createAdminEvent, updateAdminEvent, deleteAdminEvent } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'

const emptyForm = { title: '', summary: '', description: '', start_at: '', end_at: '', location: '', city: '', is_published: '1' }

export default function EventsManagement() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    setData(null)
    getAdminEvents(page, 10, { search, filter })
      .then(setData)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, search, filter])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImage(null); setShowModal(true); setError('') }
  const openEdit = (ev) => {
    setEditing(ev)
    setForm({
      title: ev.title, summary: ev.summary || '', description: ev.description || '',
      start_at: ev.start_at?.slice(0, 16) || '', end_at: ev.end_at?.slice(0, 16) || '',
      location: ev.location || '', city: ev.city || '', is_published: ev.is_published ? '1' : '0',
    })
    setImage(null); setShowModal(true); setError('')
  }

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)
      if (editing) { fd.append('_method', 'PUT'); await updateAdminEvent(editing.id, fd) }
      else await createAdminEvent(fd)
      setSuccess(editing ? 'تم تحديث الفعالية بنجاح.' : 'تم إنشاء الفعالية بنجاح.')
      setShowModal(false); load()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleDelete = async (ev) => {
    if (!confirm(`حذف "${ev.title}"؟`)) return
    try { await deleteAdminEvent(ev.id); load() } catch (err) { setError(err.message) }
  }

  const formatDate = (dt) => dt ? new Date(dt).toLocaleString('ar-OM', { dateStyle: 'short', timeStyle: 'short' }) : '—'

  return (
    <>
      <PageHeader icon="bi-calendar-event" title="إدارة الفعاليات"
        actions={<button className="btn btn-primary" onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>فعالية جديدة</button>} />

      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="ابحث بالعنوان..."
              value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
            <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter} onChange={(e) => { setPage(1); setFilter(e.target.value) }}>
            <option value="">كل الفعاليات</option>
            <option value="upcoming">القادمة</option>
            <option value="past">السابقة</option>
          </select>
        </div>
      </div>

      {!data ? <Spinner /> : data.data.length === 0 ? <EmptyState icon="bi-calendar-event" title="لا توجد فعاليات" action={<button className="btn btn-primary" onClick={openCreate}>إضافة فعالية</button>} />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 bg-white rounded-3">
                <thead className="table-light">
                  <tr><th>العنوان</th><th>البداية</th><th>الموقع</th><th>الحالة</th><th className="text-end">إجراءات</th></tr>
                </thead>
                <tbody>
                  {data.data.map((ev) => (
                    <tr key={ev.id}>
                      <td className="fw-bold">{ev.title}</td>
                      <td className="text-muted small">{formatDate(ev.start_at)}</td>
                      <td className="text-muted small">{ev.city || ev.location || '—'}</td>
                      <td><span className={`badge ${ev.is_published ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{ev.is_published ? 'منشور' : 'مسودة'}</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(ev)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ev)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showModal} title={editing ? 'تعديل فعالية' : 'فعالية جديدة'} onClose={() => setShowModal(false)} size="lg">
        {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">العنوان <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="title" required value={form.title} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">تاريخ البدء <span className="text-danger">*</span></label>
              <input type="datetime-local" className="form-control" name="start_at" required value={form.start_at} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">تاريخ الانتهاء</label>
              <input type="datetime-local" className="form-control" name="end_at" value={form.end_at} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">الموقع</label>
              <input type="text" className="form-control" name="location" value={form.location} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">المدينة</label>
              <input type="text" className="form-control" name="city" value={form.city} onChange={handleFormChange} />
            </div>
            <div className="col-12">
              <label className="form-label">الملخص</label>
              <textarea className="form-control" name="summary" rows="2" value={form.summary} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">الوصف</label>
              <textarea className="form-control" name="description" rows="5" value={form.description} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">الصورة</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="col-md-6">
              <label className="form-label">الحالة</label>
              <select className="form-select" name="is_published" value={form.is_published} onChange={handleFormChange}>
                <option value="1">منشور</option><option value="0">مسودة</option>
              </select>
            </div>
            <div className="col-12 d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm"></span> : 'حفظ'}</button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}
