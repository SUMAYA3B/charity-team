export default function Modal({ show, title, onClose, children, size = 'lg' }) {
  if (!show) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,.5)' }}>
      <div className={`modal-dialog modal-${size} modal-dialog-centered modal-dialog-scrollable`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>إغلاق</button>
          </div>
        </div>
      </div>
    </div>
  )
}
