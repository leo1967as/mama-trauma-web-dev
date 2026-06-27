// Safe date converter — handles Firestore Timestamp, ISO string, Date, null
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate(); // Firestore Timestamp
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(value, fallback = '—') {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value, fallback = '—') {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatRelative(value, fallback = '—') {
  const d = toDate(value);
  if (!d) return fallback;
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'เมื่อวาน';
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return formatDate(d);
}

export function daysSince(value) {
  const d = toDate(value);
  if (!d) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}
