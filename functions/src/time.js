const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function parseTime(value) {
  if (typeof value !== 'string' || !TIME_PATTERN.test(value)) return null;
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

export function getLocalParts(value, timeZone) {
  const date = value instanceof Date ? value : new Date(value);
  if (!timeZone || Number.isNaN(date.getTime())) return null;

  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).formatToParts(date)
        .filter(({ type }) => type !== 'literal')
        .map(({ type, value: part }) => [type, Number(part)]),
    );

    return parts;
  } catch {
    return null;
  }
}

export function getLocalDateKey(value, timeZone) {
  const parts = getLocalParts(value, timeZone);
  if (!parts) return null;
  return [parts.year, parts.month, parts.day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
}

export function isReminderDue(value, preferredTime, timeZone) {
  const target = parseTime(preferredTime);
  const parts = getLocalParts(value, timeZone);
  if (target === null || !parts) return false;
  return parts.hour * 60 + parts.minute >= target;
}
