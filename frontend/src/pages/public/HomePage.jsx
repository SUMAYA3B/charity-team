    import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHome } from '../../api/api'
import SectionTitle from '../../components/ui/SectionTitle'
import Spinner from '../../components/ui/Spinner'
import CaseCard from '../../components/public/CaseCard'
import NewsCard from '../../components/public/NewsCard'
import EventCard from '../../components/public/EventCard'
import Alert from '../../components/ui/Alert'
import bk from '../../assets/BK.png'

export default function HomePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getHome()
      .then(setData)
      .catch(() => setError('تعذر تحميل البيانات'))
  }, [])

  if (error) return <div className="container my-5"><Alert type="danger" message={error} /></div>
  if (!data) return <Spinner text="جاري تحميل الصفحة الرئيسية..." />

  const { stats, featured_cases, latest_news, latest_events } = data.data

  return (
    <>
      {/* Hero */}
      <section className="home-hero text-white">
        {/* خلفية الصورة */}
        <div
          className="home-hero-bg"
          style={{ backgroundImage: `url(${bk})` }}
          role="img"
          aria-label="صورة خلفية خيرية لفريق الخيري"
        ></div>
        {/* طبقة تعتيم لضمان وضوح النص */}
        <div className="home-hero-overlay" aria-hidden="true"></div>

        <div className="container home-hero-inner">
          <div className="home-hero-eyebrow fade-up a1">
         
          </div>
          <h1 className="home-hero-title fade-up a2">
            كن سببًا في رسم <span className="hero-highlight">البسمة</span> على وجوه المحتاجين
          </h1>
          <div className="home-hero-ornament fade-up a3" aria-hidden="true"></div>
          <p className="home-hero-text fade-up a3">
            منصة آمنة وشفافة لتمكين العطاء ودعم المشاريع الإنسانية والخيرية
          </p>
          <div className="home-hero-actions fade-up a4">
            <Link to="/donate" className="btn btn-gold btn-lg px-4 px-md-5 rounded-pill fw-bold">
        تبرع الآن
            </Link>
            <Link to="/cases" className="btn btn-outline-light btn-lg px-4 rounded-pill">
              اكتشف الحالات <i className="bi bi-arrow-left ms-2" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container section-stats">
        <div className="row g-3 text-center justify-content-center">
          <div className="col-6 col-md-3">
            <div className="stat-card h-100">
              <span className="stat-icon text-bg-success"><i className="bi bi-cash-coin"></i></span>
              <div className="stat-value">{stats.total_donated_amount.toLocaleString('ar-OM')}</div>
              <div className="stat-label">ر.ع إجمالي التبرعات</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card h-100">
              <span className="stat-icon text-bg-primary"><i className="bi bi-people"></i></span>
              <div className="stat-value">{stats.total_donation_count.toLocaleString('ar-OM')}</div>
              <div className="stat-label">تبرع</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card h-100">
              <span className="stat-icon text-bg-danger"><i className="bi bi-heart"></i></span>
              <div className="stat-value">{stats.active_cases.toLocaleString('ar-OM')}</div>
              <div className="stat-label">حالة نشطة</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card h-100">
              <span className="stat-icon text-bg-info"><i className="bi bi-check-circle"></i></span>
              <div className="stat-value">{stats.completed_cases.toLocaleString('ar-OM')}</div>
              <div className="stat-label">حالة مكتملة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured cases */}
      <section className="py-5 bg-light">
        <div className="container">
          <SectionTitle title="حالات تبرع مميزة" subtitle="اختر الحالة التي تهمك وساهم في دعمها" />
          <div className="row g-4">
            {featured_cases.map((c) => (
              <div className="col-md-6 col-lg-4" key={c.id}><CaseCard item={c} /></div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/cases" className="btn btn-outline-primary">عرض جميع الحالات</Link>
          </div>
        </div>
      </section>

      {/* News */}
      {latest_news.length > 0 && (
        <section className="py-5">
          <div className="container">
            <SectionTitle title="آخر الأخبار" />
            <div className="row g-4">
              {latest_news.map((n) => (
                <div className="col-md-4" key={n.id}><NewsCard item={n} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {latest_events.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <SectionTitle title="الفعاليات القادمة" />
            <div className="row g-4">
              {latest_events.map((e) => (
                <div className="col-md-4" key={e.id}><EventCard item={e} /></div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
