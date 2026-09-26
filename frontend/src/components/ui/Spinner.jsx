export default function Spinner({ text = 'جاري التحميل...', center = true }) {
  return (
    <div className={`d-flex align-items-center gap-2 ${center ? 'justify-content-center my-5' : ''}`}>
      <div className="spinner-border spinner-border-sm text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted">{text}</span>
    </div>
  )
}
