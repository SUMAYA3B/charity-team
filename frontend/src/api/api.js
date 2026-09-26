// ============================================
// API Service Layer — الاتصال بالـ Backend
// ============================================

const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1')

// ===== أدوات مساعدة =====

const TOKEN_KEY = 'donation_admin_token'
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token || '')
export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const buildHeaders = (json = false) => {
  const headers = { Accept: 'application/json' }
  if (json) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const handleError = async (res) => {
  if (res.ok) return null
  let message = 'حدث خطأ غير متوقع'
  if (res.status === 401) message = 'انتهت الجلسة، يرجى تسجيل الدخول مجددًا'
  else if (res.status === 403) message = 'غير مصرح لك بالوصول'
  else if (res.status === 404) message = 'العنصر المطلوب غير موجود'
  try {
    const data = await res.json()
    if (data?.message) message = data.message
    else if (data?.errors) {
      const first = Object.values(data.errors)[0]
      message = Array.isArray(first) ? first[0] : first
    }
  } catch (e) { /* تجاهل */ }
  const error = new Error(message)
  error.status = res.status
  throw error
}

const request = async (url, options = {}) => {
  const res = await fetch(`${API_BASE}${url}`, options)
  await handleError(res)
  return res.json()
}

// ===== المصادقة (Admin) =====

export const adminLogin = async (email, password) => request('/admin/auth/login', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify({ email, password }),
})

export const logout = async () => {
  try {
    return await request('/auth/logout', {
      method: 'POST',
      headers: buildHeaders(true),
    })
  } finally {
    clearToken()
  }
}

export const getMe = async () => request('/me', { headers: buildHeaders() })

// ===== البيانات العامة (Public) =====

export const getHome = async () => request('/home', { headers: buildHeaders() })
export const getStats = async () => request('/stats', { headers: buildHeaders() })
export const getSettings = async () => request('/settings', { headers: buildHeaders() })

export const getNews = async (page = 1, perPage = 9, search = '') => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (search) q.set('search', search)
  return request(`/news?${q}`, { headers: buildHeaders() })
}
export const getNewsLatest = async () => request('/news/latest', { headers: buildHeaders() })
export const getNewsBySlug = async (slug) => request(`/news/${slug}`, { headers: buildHeaders() })

export const getEvents = async (page = 1, perPage = 9, filter = '') => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (filter) q.set('filter', filter)
  return request(`/events?${q}`, { headers: buildHeaders() })
}
export const getEventsLatest = async () => request('/events/latest', { headers: buildHeaders() })
export const getEventBySlug = async (slug) => request(`/events/${slug}`, { headers: buildHeaders() })

export const getCases = async (page = 1, perPage = 9) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  return request(`/cases?${q}`, { headers: buildHeaders() })
}
export const getCaseBySlug = async (slug) => request(`/cases/${slug}`, { headers: buildHeaders() })

export const sendContact = async (payload) => request('/contact', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify(payload),
})

// التسجيل كمتطوع
export const submitVolunteer = async (payload) => request('/volunteers', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify(payload),
})

// ===== التبرعات والدفع =====

export const createDonationSession = async (payload) => request('/donations/create-session', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify(payload),
})

export const verifyDonation = async (sessionId) => request('/donations/verify', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify({ session_id: sessionId }),
})

// DEV-ONLY helper: confirm a ref-based donation (no real gateway/webhook)
export const confirmDemoDonation = async (ref) => request('/donations/confirm-demo', {
  method: 'POST',
  headers: buildHeaders(true),
  body: JSON.stringify({ ref }),
})

export const getDonation = async (referenceNumber) => request(`/donations/${referenceNumber}`, {
  headers: buildHeaders(),
})

// ===== لوحة التحكم (Admin) =====

export const getDashboard = async () => request('/admin/dashboard', { headers: buildHeaders() })

// الأخبار
export const getAdminNews = async (page = 1, perPage = 10, params = {}) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.search) q.set('search', params.search)
  if (params.status !== undefined && params.status !== '') q.set('status', params.status)
  return request(`/admin/news?${q}`, { headers: buildHeaders() })
}

const sendFormData = async (url, formData, method = 'POST') => {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: buildHeaders(),
    body: formData,
  })
  await handleError(res)
  return res.json()
}

export const createAdminNews = (formData) => sendFormData('/admin/news', formData)
export const updateAdminNews = (id, formData) => sendFormData(`/admin/news/${id}`, formData, 'PUT')
export const deleteAdminNews = (id) => request(`/admin/news/${id}`, { method: 'DELETE', headers: buildHeaders() })

// الفعاليات
export const getAdminEvents = async (page = 1, perPage = 10, params = {}) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.search) q.set('search', params.search)
  if (params.filter) q.set('filter', params.filter)
  return request(`/admin/events?${q}`, { headers: buildHeaders() })
}
export const createAdminEvent = (formData) => sendFormData('/admin/events', formData)
export const updateAdminEvent = (id, formData) => sendFormData(`/admin/events/${id}`, formData, 'PUT')
export const deleteAdminEvent = (id) => request(`/admin/events/${id}`, { method: 'DELETE', headers: buildHeaders() })

// حالات التبرع
export const getAdminCases = async (page = 1, perPage = 10, params = {}) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.search) q.set('search', params.search)
  if (params.status) q.set('status', params.status)
  return request(`/admin/cases?${q}`, { headers: buildHeaders() })
}
export const createAdminCase = (formData) => sendFormData('/admin/cases', formData)
export const updateAdminCase = (id, formData) => sendFormData(`/admin/cases/${id}`, formData, 'PUT')
export const deleteAdminCase = (id) => request(`/admin/cases/${id}`, { method: 'DELETE', headers: buildHeaders() })

// التبرعات (عرض/بحث)
export const getAdminDonations = async (page = 1, perPage = 10, params = {}) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.search) q.set('search', params.search)
  if (params.status) q.set('status', params.status)
  if (params.date_from) q.set('date_from', params.date_from)
  if (params.date_to) q.set('date_to', params.date_to)
  return request(`/admin/donations?${q}`, { headers: buildHeaders() })
}
export const getDonationsSummary = async () => request('/admin/donations/summary', { headers: buildHeaders() })

// رسائل التواصل
export const getAdminContacts = async (page = 1, perPage = 10, status = '') => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (status !== '') q.set('status', status)
  return request(`/admin/contacts?${q}`, { headers: buildHeaders() })
}
export const markContactRead = (id) => request(`/admin/contacts/${id}/read`, {
  method: 'PATCH', headers: buildHeaders(true), body: JSON.stringify({ is_read: true }),
})
export const deleteAdminContact = (id) => request(`/admin/contacts/${id}`, { method: 'DELETE', headers: buildHeaders() })

// سجل المتطوعين
export const getAdminVolunteers = async (page = 1, perPage = 10, params = {}) => {
  const q = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (params.status) q.set('status', params.status)
  if (params.search) q.set('search', params.search)
  return request(`/admin/volunteers?${q}`, { headers: buildHeaders() })
}
export const updateVolunteerStatus = (id, status) => request(`/admin/volunteers/${id}/status`, {
  method: 'PATCH', headers: buildHeaders(true), body: JSON.stringify({ status }),
})
export const deleteAdminVolunteer = (id) => request(`/admin/volunteers/${id}`, { method: 'DELETE', headers: buildHeaders() })
