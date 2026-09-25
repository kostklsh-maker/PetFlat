/** Dates are stored as ISO "YYYY-MM-DD"; users type them the Israeli way, DD/MM/YYYY. */

export function isIsoDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

/** Accepts DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY (day and month may be one digit) or ISO. Returns ISO or null. */
export function parseDateInput(input: string): string | null {
  const s = input.trim();
  if (isIsoDate(s)) return s;
  const m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s);
  if (!m) return null;
  const iso = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return isIsoDate(iso) ? iso : null;
}

/** ISO → DD/MM/YYYY for prefilling inputs. */
export function toInputDate(iso?: string): string {
  if (!iso || !isIsoDate(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Days from today until the given date (negative when overdue). */
export function daysUntil(iso: string): number {
  return Math.round((Date.parse(iso) - Date.parse(todayIso())) / 86_400_000);
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday(iso: string): number {
  return new Date(iso + 'T00:00:00Z').getUTCDay();
}
