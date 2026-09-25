import { useMemo } from 'react';
import { useStore } from '../store/AppStore';
import { en } from './en';
import { he } from './he';
import { ru } from './ru';
import { isRtlLang } from './direction';
import type { Dict, L10n, Lang, TKey } from './types';

export type { L10n, Lang, TKey } from './types';
export { deviceLang } from './device';

const DICTS: Record<Lang, Dict> = { ru, en, he };

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'he', label: 'עברית' },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
];

const LOCALE: Record<Lang, string> = { ru: 'ru-RU', en: 'en-IL', he: 'he-IL' };

export const CURRENCY = 'ILS';

export function translate(lang: Lang, key: TKey, params?: Record<string, string | number>): string {
  const s = DICTS[lang][key] ?? ru[key];
  return params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s;
}

function ageLabel(lang: Lang, months: number): string {
  const y = Math.floor(months / 12);
  if (lang === 'he') {
    if (months < 12) return months === 1 ? 'חודש' : months === 2 ? 'חודשיים' : `${months} חודשים`;
    return y === 1 ? 'שנה' : y === 2 ? 'שנתיים' : `${y} שנים`;
  }
  if (lang === 'en') {
    if (months < 12) return `${months} mo`;
    return y === 1 ? '1 year' : `${y} years`;
  }
  if (months < 12) return `${months} мес.`;
  const word = y % 10 === 1 && y % 100 !== 11 ? 'год' : [2, 3, 4].includes(y % 10) && ![12, 13, 14].includes(y % 100) ? 'года' : 'лет';
  return `${y} ${word}`;
}

export function useT() {
  const { state } = useStore();
  const lang = state.lang;
  return useMemo(() => {
    const locale = LOCALE[lang];
    const moneyWhole = new Intl.NumberFormat(locale, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 });
    const moneyCents = new Intl.NumberFormat(locale, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 });
    const money = (n: number) => (Number.isInteger(n) ? moneyWhole : moneyCents).format(n);
    const rtl = isRtlLang(lang);
    const number = new Intl.NumberFormat(locale);
    const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    return {
      lang,
      rtl,
      t: (key: TKey, params?: Record<string, string | number>) => translate(lang, key, params),
      /** Picks the current language from catalog/demo data. */
      tr: (s: L10n) => s[lang],
      /** Amount in shekels; 0 renders as "free". */
      price: (n: number) => (n === 0 ? translate(lang, 'common.free') : money(n)),
      money,
      /**
       * Joins non-empty parts with " · ". In Hebrew each part is a bidi isolate (FSI…PDI), so Latin/Cyrillic
       * fragments (breeds, user input) keep their own direction without reordering the rest of the line.
       */
      join: (parts: (string | number | false | null | undefined)[]) => {
        const items = parts.filter((x) => x !== '' && x != null && x !== false).map(String);
        return rtl ? items.map((x) => `\u2068${x}\u2069`).join(' · ') : items.join(' · ');
      },
      num: (n: number) => number.format(n),
      /** ISO "YYYY-MM-DD" → localized date. */
      date: (iso?: string) => {
        if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso ?? '';
        return date.format(new Date(iso + 'T00:00:00Z'));
      },
      age: (birthIso: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(birthIso)) return '';
        const b = new Date(birthIso);
        const now = new Date();
        let months = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
        if (now.getDate() < b.getDate()) months--;
        return months < 0 ? '' : ageLabel(lang, months);
      },
    };
  }, [lang]);
}
