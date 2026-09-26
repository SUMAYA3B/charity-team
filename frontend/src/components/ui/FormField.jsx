export default function FormField({ label, error, required, hint, children, col }) {
  return (
    <div className={col ? `col-12 col-md-${col}` : 'col-12'}>
      <div className="mb-3">
        {label && (
          <label className="form-label">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        {children}
        {hint && <div className="form-text">{hint}</div>}
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    </div>
  )
}
