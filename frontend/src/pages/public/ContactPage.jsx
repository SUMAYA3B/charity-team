import { useState } from 'react'
import { submitVolunteer } from '../../api/api'
import SectionTitle from '../../components/ui/SectionTitle'
import Alert from '../../components/ui/Alert'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  city: '',
  gender: '',
  ageGroup: '',
  skills: '',
  availability: '',
  notes: '',
}

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSending(true)
    try {
      await submitVolunteer(form)
      setSuccess('تم تسجيلك بنجاح، وسيتواصل معك فريق الجمعية الخيرية عند توفر الفرص والمبادرات المناسبة.')
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '860px' }}>
      <SectionTitle
        title="سجل كمتطوع"
        subtitle="املأ البيانات التالية، وسيتواصل معك فريق الجمعية الخيرية عند توفر الفرص والمبادرات المناسبة."
      />
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
          {success && <div className="mb-3"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">الاسم الكامل <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="name" required value={form.name} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label">رقم الهاتف <span className="text-danger">*</span></label>
                <input type="tel" className="form-control" name="phone" required value={form.phone} onChange={handleChange} dir="ltr" />
              </div>
              <div className="col-md-6">
                <label className="form-label">البريد الإلكتروني</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} dir="ltr" />
              </div>

              <div className="col-md-6">
                <label className="form-label">المدينة</label>
                <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">الجنس</label>
                <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">الفئة العمرية</label>
                <select className="form-select" name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                  <option value="">اختر الفئة العمرية</option>
                  <option>10-14</option>
                  <option>14-18</option>
                  <option>18-30</option>
                  <option>30-50</option>
                  <option>50-70</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">المهارات أو مجالات المساهمة</label>
                <textarea className="form-control" name="skills" rows="3" value={form.skills} onChange={handleChange} placeholder="مثال: مهارات تقنية، خبرة تدريبية، أعمال ميدانية، تنظيم فعاليات، قدرات إدارية..." />
              </div>
              <div className="col-12">
                <label className="form-label">التوفر</label>
                <input type="text" className="form-control" name="availability" value={form.availability} onChange={handleChange} placeholder="مثال: أيام الأسبوع، نهاية الأسبوع، مساءً..." />
              </div>
              <div className="col-12">
                <label className="form-label">ملاحظات إضافية</label>
                <textarea className="form-control" name="notes" rows="3" value={form.notes} onChange={handleChange} />
              </div>

              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary px-5" disabled={sending}>
                  {sending ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>جاري الإرسال...</>
                  ) : (
                    <><i className="bi bi-person-plus me-2"></i>إرسال طلب التطوع</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
