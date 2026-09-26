import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ui/ErrorBoundary'
import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'
import HomePage from './pages/public/HomePage'
import CasesPage from './pages/public/CasesPage'
import CaseDetailPage from './pages/public/CaseDetailPage'
import DonatePage from './pages/public/DonatePage'
import DonationSuccessPage from './pages/public/DonationSuccessPage'
import DonationCancelPage from './pages/public/DonationCancelPage'
import NewsPage from './pages/public/NewsPage'
import NewsDetailPage from './pages/public/NewsDetailPage'
import EventsPage from './pages/public/EventsPage'
import EventDetailPage from './pages/public/EventDetailPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import NewsManagement from './pages/admin/NewsManagement'
import EventsManagement from './pages/admin/EventsManagement'
import CasesManagement from './pages/admin/CasesManagement'
import DonationsManagement from './pages/admin/DonationsManagement'
import ContactsManagement from './pages/admin/ContactsManagement'
import VolunteersManagement from './pages/admin/VolunteersManagement'

export default function App() {
  return (
    <ErrorBoundary showError>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:slug" element={<CaseDetailPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/donation/success" element={<DonationSuccessPage />} />
          <Route path="/donate/success" element={<DonationSuccessPage />} />
          <Route path="/donation/cancel" element={<DonationCancelPage />} />
          <Route path="/donate/cancelled" element={<DonationCancelPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="events" element={<EventsManagement />} />
          <Route path="cases" element={<CasesManagement />} />
          <Route path="donations" element={<DonationsManagement />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="volunteers" element={<VolunteersManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
