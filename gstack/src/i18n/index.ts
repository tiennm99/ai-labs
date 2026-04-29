import { vi } from './vi';

const locales = { vi } as const;

export type LocaleKey = keyof typeof locales;

const defaultLocale: LocaleKey = 'vi';

export function t(): typeof vi {
  return locales[defaultLocale];
}
