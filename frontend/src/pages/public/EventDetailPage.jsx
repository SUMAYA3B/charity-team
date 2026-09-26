import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEventBySlug } from '../../api/api'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getEventBySlug(slug)
      .then((res) => setEvent(res.data))
      .catch(() => setError('لم يتم العثور على الفعالية'))
  }, [slug])

  if (error) return <div className="container my-5"><EmptyState icon="bi-search" title="غير موجود" description={error} /></div>
  if (!event) return <Spinner text="جاري التحميل..." />

  return (
    <article className="container py-5" style={{ maxWidth: '860px' }}>
      {event.image && <img src={event.image} alt={event.title} className="img-fluid rounded-3 w-100 mb-4" style={{ maxHeight: '420px', objectFit: 'cover' }} />}
      <h1 className="fw-bold">{event.title}</h1>
      <div className="d-flex flex-wrap gap-3 text-muted my-3">
        <span><i className="bi bi-calendar3 me-1 text-primary"></i>{event.start_at_formatted}</span>
        {event.location && <span><i className="bi bi-geo-alt me-1 text-primary"></i>{event.location}{event.city && ` — ${event.city}`}</span>}
      </div>
      {event.summary && <p className="lead text-muted">{event.summary}</p>}
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
    </article>
  )
}
