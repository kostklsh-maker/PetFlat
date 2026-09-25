import type { Lang } from './types';

/** Language of the device, used until the user picks one. */
export function deviceLang(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    if (locale.startsWith('he') || locale.startsWith('iw')) return 'he';
    if (locale.startsWith('ru')) return 'ru';
  } catch {}
  return 'en';
}
