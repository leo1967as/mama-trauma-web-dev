export function deliveryKey(...parts) {
  return parts.map(part => encodeURIComponent(String(part))).join('__');
}

function timestampMs(value) {
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (Number.isFinite(value)) return value;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function shouldClaimDelivery(record, nowMs, leaseMs) {
  if (!record) return true;
  if (record.status === 'sent') return false;
  if (record.status === 'sending' && timestampMs(record.lease_until) > nowMs) return false;
  return true;
}
