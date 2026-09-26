import { useEffect, useState } from 'react'
import { getAdminCases, createAdminCase, updateAdminCase, deleteAdminCase } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Pagination from '../../components/ui/Pagination'

const emptyForm = {
  title: '', summary: '', description: '',
  target_amount: '', start_date: '', end_date: '', status: 'draft',
}

export default function CasesManagement() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [featuredImage, setFeaturedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    setData(null)
    getAdminCases(page, 10, { search, status })
      .then(setData)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [page, search, status])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFeaturedImage(null); setShowModal(true); setError('') }
  const openEdit = (c) => {
    setEditing(c)
    setForm({
      title: c.title, summary: c.summary || '', description: c.description || '',
      target_amount: c.target_amount, start_date: c.start_date?.slice(0, 10) || '', end_date: c.end_date?.slice(0, 10) || '',
      status: c.status,
    })
    setFeaturedImage(null); setShowModal(true); setError('')
  }

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (featuredImage) fd.append('featured_image', featuredImage)
      if (editing) { fd.append('_method', 'PUT'); await updateAdminCase(editing.id, fd) }
      else await createAdminCase(fd)
      setSuccess(editing ? 'تم تحديث الحالة بنجاح.' : 'تم إنشاء الحالة بنجاح.')
      setShowModal(false); load()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleDelete = async (c) => {
    if (!confirm(`حذف "${c.title}"؟ ستُحذف التبرعات المرتبطة.`)) return
    try { await deleteAdminCase(c.id); load() } catch (err) { setError(err.message) }
  }

  return (
    <>
      <PageHeader icon="bi-heart" title="إدارة حالات التبرع"
        actions={<button className="btn btn-primary" onClick={openCreate}><i className="bi bi-plus-lg me-1"></i>حالة جديدة</button>} />

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
          <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
            <option value="">كل الحالات</option>
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="completed">مكتمل</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {!data ? <Spinner /> : data.data.length === 0 ? <EmptyState icon="bi-heart" title="لا توجد حالات" action={<button className="btn btn-primary" onClick={openCreate}>إضافة حالة</button>} />
        : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle shadow-sm border-0 bg-white rounded-3">
                <thead className="table-light">
                  <tr><th>العنوان</th><th>المستهدف</th><th>المحصل</th><th>النسبة</th><th>الحالة</th><th className="text-end">إجراءات</th></tr>
                </thead>
                <tbody>
                  {data.data.map((c) => {
                    const sb = { draft: ['مسودة', 'secondary'], published: ['منشور', 'success'], completed: ['مكتمل', 'info'], archived: ['مؤرشف', 'secondary'] }[c.status] || [c.status, 'secondary']
                    return (
                      <tr key={c.id}>
                        <td className="fw-bold">{c.title}</td>
                        <td>{c.target_amount.toLocaleString('ar-OM')}</td>
                        <td>{c.collected_amount.toLocaleString('ar-OM')}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary-subtle text-primary">{c.completion_percentage}%</span>
                          </div>
                        </td>
                        <td><span className={`badge bg-${sb[1]}-subtle text-${sb[1]}`}>{sb[0]}</span></td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(c)}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}><i className="bi bi-trash"></i></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
          </>
        )}

      <Modal show={showModal} title={editing ? 'تعديل حالة' : 'حالة تبرع جديدة'} onClose={() => setShowModal(false)} size="lg">
        {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">العنوان <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="title" required value={form.title} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">المبلغ المستهدف (ر.ع) <span className="text-danger">*</span></label>
              <input type="number" className="form-control" name="target_amount" min="1" required value={form.target_amount} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">الحالة</label>
              <select className="form-select" name="status" value={form.status} onChange={handleFormChange}>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
                <option value="completed">مكتمل</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">تاريخ البدء</label>
              <input type="date" className="form-control" name="start_date" value={form.start_date} onChange={handleFormChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">تاريخ الانتهاء</label>
              <input type="date" className="form-control" name="end_date" value={form.end_date} onChange={handleFormChange} />
            </div>
            <div className="col-12">
              <label className="form-label">الملخص</label>
              <textarea className="form-control" name="summary" rows="2" value={form.summary} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">الوصف التفصيلي</label>
              <textarea className="form-control" name="description" rows="6" value={form.description} onChange={handleFormChange}></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">الصورة المميزة</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setFeaturedImage(e.target.files[0])} />
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
