export default function Pagination({ page, lastPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(lastPage, start + 4)

  return (
    <nav className="mt-4 d-flex justify-content-center">
      <ul className="pagination mb-0">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>السابق</button>
        </li>
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${page >= lastPage ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>التالي</button>
        </li>
      </ul>
    </nav>
  )
}
