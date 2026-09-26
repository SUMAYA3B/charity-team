export default function PageHeader({ title, subtitle, icon, actions }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center gap-3">
        {icon && <i className={`bi ${icon} text-primary fs-1`}></i>}
        <div>
          <h4 className="mb-0">{title}</h4>
          {subtitle && <p className="text-muted mb-0 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </div>
  )
}
