import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectBrowserLanguage } from '@/utils/locale/detectBrowserLanguage';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

/** Detecta idioma do navegador ou localStorage; fallback: inglês */
export function detectLanguage() {
  return detectBrowserLanguage({ preferStored: true });
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
