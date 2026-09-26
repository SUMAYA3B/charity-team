import ServiceCard from './ServiceCard'
import SectionOrnament from './SectionOrnament'

const services = [
  { icon: 'bi-gift-fill', title: 'تقديم المساعدات المالية والعينية للأسر المحتاجة' },
  { icon: 'bi-basket2-fill', title: 'توزيع السلال الغذائية والمواد الأساسية' },
  { icon: 'bi-moon-stars-fill', title: 'تنفيذ الحملات الموسمية مثل إفطار الصائم وكسوة العيد' },
  { icon: 'bi-people-fill', title: 'دعم الأيتام والأرامل والحالات الإنسانية' },
  { icon: 'bi-house-heart-fill', title: 'المساهمة في ترميم المنازل وتحسين الظروف المعيشية' },
  { icon: 'bi-bandaid-fill', title: 'توفير الأجهزة والمستلزمات الطبية لبعض الحالات المحتاجة' },
  { icon: 'bi-person-raised-hand', title: 'تنظيم المبادرات المجتمعية والبرامج التطوعية' },
  { icon: 'bi-heart-fill', title: 'نشر ثقافة العمل الخيري والتكافل الاجتماعي' },
  { icon: 'bi-chat-heart-fill', title: 'التعاون مع الأفراد والجهات الداعمة لتنفيذ المشاريع الإنسانية' },
]

export default function AboutServices() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="about-section-title reveal">
          <h2>أبرز الخدمات والأنشطة</h2>
          <SectionOrnament />
        </div>
        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className="reveal reveal-card" style={{ transitionDelay: `${(idx % 3) * 0.12}s` }}>
              <ServiceCard icon={s.icon} title={s.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
