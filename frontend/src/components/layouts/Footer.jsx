import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h5 className="text-warning fw-bold d-flex align-items-center">
              <img src={logo} alt="فريق الخيري" style={{ height: '36px', width: '36px', objectFit: 'cover', borderRadius: '50%' }} className="me-2" />
              فريق الخيري
            </h5>
            <p className="text-secondary small lh-lg">
              فريق خيري يهدف إلى جمع التبرعات ودعم المشاريع الإنسانية، وتمكين المجتمع
              من المساهمة بشكل آمن وشفاف.
            </p>
          </div>
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">روابط سريعة</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/cases" className="text-secondary text-decoration-none">حالات التبرع</Link></li>
              <li className="mb-2"><Link to="/news" className="text-secondary text-decoration-none">الأخبار</Link></li>
              <li className="mb-2"><Link to="/events" className="text-secondary text-decoration-none">الفعاليات</Link></li>
              <li className="mb-2"><Link to="/about" className="text-secondary text-decoration-none">من نحن</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h6 className="fw-bold mb-3">تواصل معنا</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><i className="bi bi-envelope me-2"></i>info@example.com</li>
              <li className="mb-2"><i className="bi bi-telephone me-2"></i>+968 00000000</li>
              <li className="mb-2"><i className="bi bi-geo-alt me-2"></i>مسقط، سلطنة عُمان</li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6 className="fw-bold mb-3">تابعنا</h6>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm"><i className="bi bi-facebook"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm"><i className="bi bi-instagram"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm"><i className="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="text-center small text-secondary">
          © {new Date().getFullYear()} فريق الخيري — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  )
}
