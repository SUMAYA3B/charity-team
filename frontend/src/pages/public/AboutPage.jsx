import { useEffect } from 'react'
import AboutServices from '../../components/about/AboutServices'
import AboutVision from '../../components/about/AboutVision'
import '../../styles/about.css'

export default function AboutPage() {
  // الظهور التدريجي للعناصر عند الوصول إليها
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('reveal-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page">
      {/* ===== نبذة عن الفريق ===== */}
      <section className="about-hero">
        <span className="pattern-overlay" aria-hidden="true"></span>
        <div className="container text-center">
          <div className="about-hero-badge">
            <span className="line"></span>
            <span>فريق عُماني تطوّعي</span>
            <span className="line"></span>
          </div>
          <div className="about-hero-icon">
            <i className="bi bi-house-heart-fill" aria-hidden="true"></i>
          </div>
          <h1>نبذة عن الفريق</h1>
          <div className="gold-divider"></div>
          <p className="hero-text">
             يقومَ الفريقُ منذُ إشهارهِ بالعديدِ
            منْ البرامجِ والمبادراتِ الإنسانيةِ والمجتمعيةِ في قرى الولايةِ وذلكَ
            منْ خلالِ إقامةِ الفعالياتِ والأنشطةِ التي تأتي ضمنَ عدةِ مبادراتٍ
            مجتمعيةٍ يقومُ بها أعضاءُ الفريقِ البالغِ عددهمْ 124 عضوا منْ مختلفِ
            قرى الولايةِ و31 مندوبا موزعينَ حسبَ التجمعاتِ السكانيةِ بالقرى.
          </p>
          <div className="about-hero-stats reveal">
            <div className="stat reveal">
              <div className="stat-value">124</div>
              <div className="stat-label">عضواً</div>
            </div>
            <div className="stat reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="stat-value">31</div>
              <div className="stat-label">مندوباً</div>
            </div>
            <div className="stat reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="stat-value">1993</div>
              <div className="stat-label">سنة التأسيس</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== الخدمات والأنشطة ===== */}
      <AboutServices />

      {/* ===== الرؤية ===== */}
      <AboutVision />
    </div>
  )
}
