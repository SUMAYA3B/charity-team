import { Link } from 'react-router-dom'

export default function EventCard({ item }) {
  return (
    <div className="card event-card h-100 shadow-sm border-0 overflow-hidden">
      {item.image ? (
        <img src={item.image} alt={item.title} className="card-img-top event-image" loading="lazy" />
      ) : (
        <div className="event-image-placeholder d-flex align-items-center justify-content-center">
          <i className="bi bi-calendar-event text-primary display-3"></i>
        </div>
      )}
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
          <span><i className="bi bi-calendar3 me-1"></i>{item.start_at_formatted}</span>
        </div>
        <h6 className="card-title fw-bold">
          <Link to={`/events/${item.slug}`} className="text-decoration-none text-dark">{item.title}</Link>
        </h6>
        {item.location && <div className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{item.location} · {item.city}</div>}
        {item.summary && <p className="text-muted small mt-2 mb-0">{item.summary}</p>}
      </div>
    </div>
  )
}
