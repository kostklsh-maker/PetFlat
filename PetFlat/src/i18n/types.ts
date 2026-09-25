import type { ru } from './ru';

export type Lang = 'ru' | 'en' | 'he';
export type TKey = keyof typeof ru;
export type Dict = Record<TKey, string>;
/** A string that exists in every supported language (catalog data, demo content). */
export type L10n = Record<Lang, string>;
