import { useEffect, useState } from 'react'
import { getEvents } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Alert from '../../components/ui/Alert'
import EventCard from '../../components/public/EventCard'

export default function EventsPage() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setData(null)
    getEvents(page, 9, filter)
      .then(setData)
      .catch((e) => setError(e.message))
  }, [page, filter])

  return (
    <div className="container py-5">
      <PageHeader icon="bi-calendar-event" title="الفعاليات" subtitle="شارك في فعالياتنا القادمة" />
      <div className="mb-4">
        <div className="btn-group">
          <button className={`btn ${filter === '' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setFilter(''); setPage(1) }}>الكل</button>
          <button className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setFilter('upcoming'); setPage(1) }}>القادمة</button>
          <button className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setFilter('past'); setPage(1) }}>السابقة</button>
        </div>
      </div>

      {error ? <Alert type="danger" message={error} />
        : !data ? <Spinner text="جاري التحميل..." />
          : data.data.length === 0 ? <EmptyState icon="bi-calendar-event" title="لا توجد فعاليات" />
            : (
              <>
                <div className="row g-4">
                  {data.data.map((e) => (
                    <div className="col-md-6 col-lg-4" key={e.id}><EventCard item={e} /></div>
                  ))}
                </div>
                <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
              </>
            )}
    </div>
  )
}
