import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../api/api'
import { clearToken } from '../../api/api'
import logo from '../../assets/logo.png'

const menu = [
  { section: 'الرئيسية', items: [{ to: '/admin', label: 'لوحة التحكم', icon: 'bi-speedometer2', end: true }] },
  {
    section: 'المحتوى',
    items: [
      { to: '/admin/cases', label: 'حالات التبرع', icon: 'bi-heart' },
      { to: '/admin/news', label: 'الأخبار', icon: 'bi-newspaper' },
      { to: '/admin/events', label: 'الفعاليات', icon: 'bi-calendar-event' },
    ],
  },
  {
    section: 'الإدارة',
    items: [
      { to: '/admin/donations', label: 'التبرعات', icon: 'bi-cash-coin' },
      { to: '/admin/contacts', label: 'رسائل التواصل', icon: 'bi-envelope' },
      { to: '/admin/volunteers', label: 'سجل المتطوعين', icon: 'bi-people' },
    ],
  },
]

export default function AdminSidebar({ user, onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch (e) { /* ignore */ }
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="admin-sidebar d-flex flex-column">
      <div className="sidebar-brand d-flex align-items-center">
        <img src={logo} alt="فريق الخيري" style={{ height: '34px', width: '34px', objectFit: 'cover', borderRadius: '50%' }} className="me-2" />
        فريق الخيري
      </div>

      <div className="sidebar-user px-3 py-2">
        <div className="d-flex align-items-center gap-2">
          <div className="avatar-circle text-white">{user?.name?.charAt(0) || 'م'}</div>
          <div className="overflow-hidden">
            <div className="text-truncate fw-bold small">{user?.name}</div>
            <div className="text-secondary small">مدير النظام</div>
          </div>
        </div>
      </div>

      <nav className="flex-grow-1 px-2 overflow-auto">
        {menu.map((grp) => (
          <div className="mb-3" key={grp.section}>
            <div className="sidebar-section-label">{grp.section}</div>
            {grp.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className={`bi ${it.icon} me-2`}></i>{it.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-3">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
