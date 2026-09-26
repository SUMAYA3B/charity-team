// أداة تنسيق الأرقام بشكل آمن
// تتفادى الأعطال عندما لا يدعم المتصفح locale (مثل 'ar-OM')
export const fmt = (value) => {
  try {
    const n = Number(value)
    if (Number.isFinite(n)) return n.toLocaleString('ar-OM')
    return '0'
  } catch (e) {
    try { return Number(value || 0).toLocaleString() } catch (_) { return '0' }
  }
}
