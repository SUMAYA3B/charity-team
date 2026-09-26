import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/header.css'

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/about', label: 'من نحن' },
  { to: '/cases', label: 'حالات التبرع' },
  { to: '/events', label: 'مبادراتنا' },
  { to: '/news', label: 'أخبارنا', },
  { to: '/contact', label: 'سجل كمتطوع' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // إغلاق قائمة الجوال عند تغيّر المسار
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // قفل تمرير الصفحة عند فتح قائمة الجوال
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // تغيّر حالة الهيدر عند التمرير
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const close = useCallback(() => setOpen(false), [])

  return (
    <header className={`heritage-header ${scrolled ? 'scrolled' : ''}`}>
      {/* الهيدر الرئيسي / شريط التنقل */}
      <div className="container">
        <div className="header-inner">
          {/* الشعار */}
          <Link className="heritage-brand" to="/" aria-label="فريق الخيري - الرئيسية">
            <span className="brand-logo-wrap">
              <img src={logo} alt="شعار فريق الخيري" className="brand-logo" />
            </span>
            <span className="brand-text d-none d-sm-block">
              <span className="brand-name d-block">فريق الخيري</span>
            </span>
          </Link>

          {/* القائمة — سطح المكتب */}
          <ul className="heritage-nav desktop-nav">
            {navLinks.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${l.icon}`} aria-hidden="true"></i>{l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* زر التبرع — سطح المكتب */}
          <Link to="/donate" className="donate-btn donate-desktop">
            <span>تبرع الآن</span>
          </Link>

          {/* زر التبرع — جوال */}
          <Link to="/donate" className="donate-btn donate-mobile" onClick={close}>
            <span>تبرع الآن</span>
          </Link>

          {/* زر فتح القائمة (جوال) */}
          <button
            type="button"
            className="heritage-toggler"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded={open}
            aria-controls="mobileNav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* القائمة الجوالية المنزلقة */}
      <nav className={`heritage-nav mobile-nav ${open ? 'open' : ''}`} id="mobileNav" aria-label="القائمة الرئيسية">
        <button type="button" className="heritage-toggler-close" onClick={close} aria-label="إغلاق القائمة">
          <i className="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        {navLinks.map((l) => (
          <div className="nav-item" key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              <i className={`bi ${l.icon}`} aria-hidden="true"></i>{l.label}
            </NavLink>
          </div>
        ))}
        <Link to="/donate" className="donate-btn donate-mobile" onClick={close} tabIndex={open ? 0 : -1}>
          <span>تبرع الآن</span>
        </Link>
      </nav>
    </header>
  )
}
