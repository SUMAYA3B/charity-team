import { useEffect, useState } from 'react'
import { getNews } from '../../api/api'
import PageHeader from '../../components/ui/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Alert from '../../components/ui/Alert'
import NewsCard from '../../components/public/NewsCard'

export default function NewsPage() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setData(null)
    getNews(page, 9, search)
      .then(setData)
      .catch((e) => setError(e.message))
  }, [page, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearch(e.target.searchText.value.trim())
  }

  return (
    <div className="container py-5">
      <PageHeader icon="bi-newspaper" title="الأخبار" subtitle="آخر أخبار المنصة والحملات" />
      <form onSubmit={handleSearch} className="row g-2 mb-4">
        <div className="col-md-5 col-lg-4">
          <div className="input-group">
            <input type="text" className="form-control" name="searchText" placeholder="ابحث في الأخبار..." />
            <button className="btn btn-primary"><i className="bi bi-search"></i></button>
          </div>
        </div>
      </form>

      {error ? <Alert type="danger" message={error} />
        : !data ? <Spinner text="جاري التحميل..." />
          : data.data.length === 0 ? <EmptyState icon="bi-newspaper" title="لا توجد أخبار" />
            : (
              <>
                <div className="row g-4">
                  {data.data.map((n) => (
                    <div className="col-md-6 col-lg-4" key={n.id}><NewsCard item={n} /></div>
                  ))}
                </div>
                <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
              </>
            )}
    </div>
  )
}
