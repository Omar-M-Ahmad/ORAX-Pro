/**
 * @file src/i18n/localize-path
 * @description Localize path for a given locale
 */

export function localizePath(locale: string, path: string): string {
  return `/${locale}${path}`;
}
