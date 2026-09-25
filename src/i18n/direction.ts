import { reloadAppAsync } from 'expo';
import { I18nManager, Platform } from 'react-native';
import type { Lang } from './types';

export const isRtlLang = (lang: Lang) => lang === 'he';

/**
 * Applies the layout direction for the language. On iOS/Android the direction only changes after a restart,
 * so the app reloads itself when needed. Callers must persist the language first.
 */
export async function applyDirection(lang: Lang): Promise<void> {
  const rtl = isRtlLang(lang);
  if (Platform.OS === 'web') {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    return;
  }
  if (I18nManager.isRTL === rtl) return;
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  await reloadAppAsync('Layout direction changed');
}
