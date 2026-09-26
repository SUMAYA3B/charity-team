const STATUS_MAP = {
  // Donations
  paid: { label: 'مكتمل', cls: 'success' },
  pending: { label: 'قيد الانتظار', cls: 'warning' },
  processing: { label: 'قيد المعالجة', cls: 'info' },
  failed: { label: 'فشل', cls: 'danger' },
  cancelled: { label: 'ملغي', cls: 'secondary' },
  // Cases / content
  published: { label: 'منشور', cls: 'success' },
  draft: { label: 'مسودة', cls: 'secondary' },
  completed: { label: 'مكتمل', cls: 'info' },
  archived: { label: 'مؤرشف', cls: 'secondary' },
}

export default function StatusChip({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'secondary' }
  return <span className={`badge bg-${s.cls}-subtle text-${s.cls} border border-${s.cls}-subtle px-2 py-1`}>{s.label}</span>
}
