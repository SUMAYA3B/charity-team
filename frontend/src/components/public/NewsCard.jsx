import { Link } from 'react-router-dom'

export default function NewsCard({ item }) {
  return (
    <div className="card news-card h-100 shadow-sm border-0 overflow-hidden">
      {item.image && (
        <img src={item.image} alt={item.title} className="card-img-top news-image" loading="lazy" />
      )}
      <div className="card-body">
        <div className="text-muted small mb-2">
          <i className="bi bi-calendar3 me-1"></i>{item.published_at_formatted || item.published_at}
        </div>
        <h6 className="card-title fw-bold">
          <Link to={`/news/${item.slug}`} className="text-decoration-none text-dark">{item.title}</Link>
        </h6>
        <p className="card-text text-muted small">{item.excerpt}</p>
      </div>
      <div className="card-footer bg-white border-0 pb-3 pt-0">
        <Link to={`/news/${item.slug}`} className="btn-link text-decoration-none">قراءة المزيد <i className="bi bi-arrow-left"></i></Link>
      </div>
    </div>
  )
}
