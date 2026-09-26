import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getNewsBySlug } from '../../api/api'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getNewsBySlug(slug)
      .then((res) => setNews(res.data))
      .catch(() => setError('لم يتم العثور على الخبر'))
  }, [slug])

  if (error) return <div className="container my-5"><EmptyState icon="bi-search" title="غير موجود" description={error} /></div>
  if (!news) return <Spinner text="جاري تحميل الخبر..." />

  return (
    <article className="container py-5" style={{ maxWidth: '820px' }}>
      <nav className="small mb-3">
        <Link to="/news" className="text-decoration-none">الأخبار</Link> / <span className="text-muted">{news.title}</span>
      </nav>
      {news.image && <img src={news.image} alt={news.title} className="img-fluid rounded-3 w-100 mb-4" style={{ maxHeight: '400px', objectFit: 'cover' }} />}
      <h1 className="fw-bold mb-2">{news.title}</h1>
      <div className="text-muted mb-4">
        <i className="bi bi-calendar3 me-1"></i>{news.published_at}
        {news.author?.name && <span className="ms-3"><i className="bi bi-person me-1"></i>{news.author.name}</span>}
      </div>
      {news.summary && <p className="lead text-muted">{news.summary}</p>}
      <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
    </article>
  )
}
