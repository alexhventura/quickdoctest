/** @deprecated Use useI18n() — mantido para imports legados */
export { LANGUAGE_LABELS, LANGUAGE_CODES } from '@/constants/languages';

import en from '@/i18n/locales/en.json';
import pt from '@/i18n/locales/pt.json';
import es from '@/i18n/locales/es.json';

export const INTERFACE_LABELS = { en, pt, es };

export function getInterfaceLabels(lang) {
  return INTERFACE_LABELS[lang] || INTERFACE_LABELS.en;
}
