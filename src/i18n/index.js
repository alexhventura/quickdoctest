import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '@/constants/rankings';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

/** Detecta idioma do navegador ou localStorage; fallback: inglês */
export function detectLanguage() {
  const stored = localStorage.getItem(STORAGE_KEYS.lang);
  if (['pt', 'en', 'es'].includes(stored)) return stored;

  const browser = (navigator.language || 'en').toLowerCase();
  if (browser.startsWith('pt')) return 'pt';
  if (browser.startsWith('es')) return 'es';
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
