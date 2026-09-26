import { useEffect, useState } from 'react'
import { getCases } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Alert from '../../components/ui/Alert'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import CaseCard from '../../components/public/CaseCard'

export default function CasesPage() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    setData(null)
    getCases(page)
      .then(setData)
      .catch((e) => setError(e.message))
  }, [page])

  if (error) return <div className="container my-5"><Alert type="danger" message={error} /></div>

  return (
    <div className="container py-5">
      <PageHeader
        icon="bi-heart"
        title="حالات التبرع"
        subtitle="تصفح حالات التبرع وساهم في دعم من يحتاج"
      />
      {!data ? <Spinner text="جاري تحميل الحالات..." />
        : data.data.length === 0 ? <EmptyState icon="bi-heart" title="لا توجد حالات حالياً"
            description="سيرجى العودة لاحقًا"
            action={<a href="/donate" className="btn btn-primary">تبرع مفتوح</a>} />
          : (
            <ErrorBoundary showError={/(localhost|127.0.0.1|debug)/i.test(window.location.hostname)}>
              <div className="row g-4">
                {data.data.map((c) => (
                  <div className="col-md-6 col-lg-4" key={c.id}><CaseCard item={c} /></div>
                ))}
              </div>
              <Pagination
                page={data.meta.current_page}
                lastPage={data.meta.last_page}
                onPageChange={setPage}
              />
            </ErrorBoundary>
          )}
    </div>
  )
}
