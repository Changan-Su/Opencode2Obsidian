/**
 * Internationalization (i18n) support for OpenCode2Obsidian
 * Provides Chinese and English language support
 */

import { en } from "./locales/en";
import { zhCN } from "./locales/zh-CN";

export type LocaleKey = keyof typeof en;
export type Locale = "en" | "zh-CN";

const locales: Record<Locale, typeof en> = {
  en,
  "zh-CN": zhCN,
};

let currentLocale: Locale = "en";

/**
 * Detect user's preferred locale based on Obsidian/system settings
 */
export function detectLocale(): Locale {
  // Try to detect from navigator language
  const navLang = navigator.language.toLowerCase();
  if (navLang.startsWith("zh")) {
    return "zh-CN";
  }
  return "en";
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Get a translated string by key
 */
export function t(key: LocaleKey): string {
  return locales[currentLocale][key] || locales["en"][key] || key;
}

/**
 * Initialize i18n with auto-detection
 */
export function initI18n(): void {
  const detected = detectLocale();
  setLocale(detected);
}

export { en, zhCN };
