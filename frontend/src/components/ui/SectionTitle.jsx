export default function SectionTitle({ title, subtitle, align = 'center' }) {
  return (
    <div className={`text-${align} mb-4`}>
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  )
}
