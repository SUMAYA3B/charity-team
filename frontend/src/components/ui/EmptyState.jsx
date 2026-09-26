export default function EmptyState({ icon = 'bi-inbox', title = 'لا توجد بيانات', description, action }) {
  return (
    <div className="empty-state text-center py-5">
      <i className={`bi ${icon} display-4 text-muted`}></i>
      <h5 className="mt-3 mb-1">{title}</h5>
      {description && <p className="text-muted mb-0">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
