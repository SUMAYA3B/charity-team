import { useEffect, useState } from 'react'
import { getAdminNews, createAdminNews, updateAdminNews, deleteAdminNews } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'

const emptyForm = { title: '', summary: '', content: '', is_published: '1' }

export default function NewsManagement() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
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
    getAdminNews(page, 10, { search })
      .then(setData)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, search])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImage(null); setShowModal(true); setError('') }
  const openEdit = (n) => { setEditing(n); setForm({ title: n.title, summary: n.summary || '', content: n.content || '', is_published: n.is_published ? '1' : '0' }); setImage(null); setShowModal(true); setError('') }

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v === '1' ? '1' : v === '0' ? '0' : v))
      if (image) fd.append('image', image)
      if (editing) { fd.append('_method', 'PUT'); await updateAdminNews(editing.id, fd) }
      else await createAdminNews(fd)
      setSuccess(editing ? 'تم تحديث الخبر بنجاح.' : 'تم إنشاء الخبر بنجاح.')
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (n) => {
    if (!confirm(`هل أنت متأكد من حذف "${n.title}"؟`)) return
    try {
      await deleteAdminNews(n.id)
      load()
    } catch (err) { setError(err.message) }
  }

  return (
    <>
      <PageHeader
        icon="bi-newspaper"
        title="إدارة الأخبار"
        actions={<button className="btn btn-primary" onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>خبر جديد</button>}
      />

      {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="ابحث بالعنوان..."
              value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
            <button className="btn btn-outline-secondary"><i className="bi bi-search"></i></button>
          </div>
        </div>
      </div>

      {!data ? <Spinner /> : data.data.length === 0 ? <EmptyState icon="bi-newspaper" title="لا توجد أخبار" action={<button className="btn btn-primary" onClick={openCreate}>إضافة خبر</button>} />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 rounded-3 bg-white">
                <thead className="table-light">
                  <tr><th>العنوان</th><th>تاريخ النشر</th><th>الحالة</th><th className="text-end">إجراءات</th></tr>
                </thead>
                <tbody>
                  {data.data.map((n) => (
                    <tr key={n.id}>
                      <td className="fw-bold">{n.title}</td>
                      <td className="text-muted small">{n.published_at?.slice(0, 10) || '—'}</td>
                      <td>
                        <span className={`badge ${n.is_published ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {n.is_published ? 'منشور' : 'مسودة'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(n)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showModal} title={editing ? 'تعديل خبر' : 'خبر جديد'} onClose={() => setShowModal(false)}>
        {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">العنوان <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="title" required value={form.title} onChange={handleFormChange} />
            </div>
            <div className="col-12">
              <label className="form-label">الملخص</label>
              <textarea className="form-control" name="summary" rows="2" value={form.summary} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">المحتوى</label>
              <textarea className="form-control" name="content" rows="6" value={form.content} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">الصورة</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="col-md-6">
              <label className="form-label">الحالة</label>
              <select className="form-select" name="is_published" value={form.is_published} onChange={handleFormChange}>
                <option value="1">منشور</option>
                <option value="0">مسودة</option>
              </select>
            </div>
            <div className="col-12 d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'حفظ'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}
