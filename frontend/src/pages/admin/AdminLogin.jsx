import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin, setToken } from '../../api/api'
import Alert from '../../components/ui/Alert'
import logo from '../../assets/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminLogin(email, password)
      setToken(res?.token || res?.data?.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light p-3">
      <div className="card shadow border-0" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img src={logo} alt="فريق الخيري" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.12)' }} className="mb-2" />
            <h4 className="fw-bold mt-2">لوحة تحكم فريق الخيري</h4>
            <p className="text-muted">سجّل الدخول للمتابعة</p>
          </div>
          {error && <div className="mb-3"><Alert type="danger" message={error} onClose={() => setError('')} /></div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">كلمة المرور</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>جاري الدخول...</> : <>دخول <i className="bi bi-box-arrow-in-left ms-1"></i></>}
            </button>
          </form>
          <div className="text-center mt-3">
            <Link to="/" className="btn btn-link btn-sm"><i className="bi bi-arrow-right me-1"></i>العودة إلى الموقع</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
