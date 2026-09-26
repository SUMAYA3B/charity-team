export default function ServiceCard({ icon, title }) {
  return (
    <div className="service-card">
      <div className="service-icon-wrap">
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </div>
      <h3 className="service-title">{title}</h3>
    </div>
  )
}
