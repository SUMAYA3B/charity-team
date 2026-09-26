export default function AdminTopbar({ onMenu }) {
  return (
    <header className="admin-topbar d-flex align-items-center justify-content-between px-3 py-2">
      <button className="btn btn-light d-lg-none" onClick={onMenu}>
        <i className="bi bi-list"></i>
      </button>
      <div className="d-none d-lg-block text-muted small">
        لوحة إدارة منصة التبرعات
      </div>
      <div>
        <span className="badge bg-primary-subtle text-primary">
          <i className="bi bi-shield-lock me-1"></i>لوحة تحكم آمنة
        </span>
      </div>
    </header>
  )
}
