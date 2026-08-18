import { vi } from './vi';

const locales = /** @type {const} */ ({ vi });

/** @typedef {keyof typeof locales} LocaleKey */

/** @type {LocaleKey} */
const defaultLocale = 'vi';

/** @returns {typeof vi} */
export function t() {
  return locales[defaultLocale];
}
