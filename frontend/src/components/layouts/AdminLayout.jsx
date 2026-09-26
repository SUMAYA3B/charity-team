import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { getMe, clearToken, getToken } from '../../api/api'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import Spinner from '../ui/Spinner'

export default function AdminLayout() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sideOpen, setSideOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.href = '/admin/login'
      return
    }
    getMe()
      .then((res) => setUser(res.user))
      .catch(() => { clearToken(); window.location.href = '/admin/login' })
      .finally(() => setLoading(false))
  }, [location.pathname])

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner text="جاري التحقق من الجلسة..." /></div>

  return (
    <div className="admin-shell d-flex">
      <div className={`admin-sidebar-wrap ${sideOpen ? 'open' : ''}`}>
        <AdminSidebar user={user} onClose={() => setSideOpen(false)} />
      </div>
      <div className="admin-main flex-grow-1 min-vh-100 d-flex flex-column">
        <AdminTopbar onMenu={() => setSideOpen(true)} />
        <main className="p-3 p-lg-4 flex-grow-1">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  )
}
