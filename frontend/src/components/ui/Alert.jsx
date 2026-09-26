const VARIANT_ICONS = { success: 'check-circle', danger: 'x-circle', warning: 'exclamation-triangle', info: 'info-circle' }

export default function Alert({ type = 'info', message, onClose, dismissible = true }) {
  if (!message) return null
  return (
    <div className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2`} role="alert">
      <i className={`bi bi-${VARIANT_ICONS[type] || 'info-circle'}`}></i>
      <div className="flex-grow-1">{message}</div>
      {dismissible && onClose && (
        <button type="button" className="btn-close" onClick={onClose}></button>
      )}
    </div>
  )
}
