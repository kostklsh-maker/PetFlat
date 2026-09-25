const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/** "2026-09-25" -> "25 сен 2026". Returns the input unchanged if it is not an ISO date. */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ageLabel(birthIso: string): string {
  if (!isIsoDate(birthIso)) return '';
  const b = new Date(birthIso);
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) months--;
  if (months < 0) return '';
  if (months < 12) return `${months} мес.`;
  const y = Math.floor(months / 12);
  const word = y % 10 === 1 && y % 100 !== 11 ? 'год' : [2, 3, 4].includes(y % 10) && ![12, 13, 14].includes(y % 100) ? 'года' : 'лет';
  return `${y} ${word}`;
}

export function rub(n: number): string {
  return n === 0 ? 'Бесплатно' : `${n.toLocaleString('ru-RU')} ₽`;
}

/** Days from today until the given date (negative when overdue). */
export function daysUntil(iso: string): number {
  const ms = Date.parse(iso) - Date.parse(todayIso());
  return Math.round(ms / 86_400_000);
}
