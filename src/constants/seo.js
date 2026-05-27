export const SITE_URL = 'https://www.quickdoctest.com';
export const SITE_NAME = 'QuickDocTest';
export const SITE_CATEGORY = 'EducationalApplication';
export const SITE_LOGO = `${SITE_URL}/favicon.svg`;

export const DEFAULT_TITLE = 'QuickDocTest | Professional Typing Speed Test';
export const DEFAULT_DESCRIPTION =
  'Measure typing speed, accuracy and performance with internationally recognized metrics and digital certification.';
export const DEFAULT_KEYWORDS = [
  'typing speed test',
  'wpm test',
  'typing accuracy',
  'typing certification',
  'QuickDocTest',
  'teste de digitacao',
  'prueba de mecanografia',
].join(', ');
export const SITE_AUTHOR = 'QuickDocTest Team';

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_CARD = 'summary_large_image';

export const LOCALE_PATHS = ['pt', 'en', 'es'];

export const HREFLANG_MAP = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

export const SEO_BY_LANG = {
  pt: {
    title: 'QuickDocTest | Teste Profissional de Velocidade de Digitação',
    description:
      'Meça velocidade, precisão e desempenho na digitação com métricas reconhecidas internacionalmente e certificação digital.',
  },
  en: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  es: {
    title: 'QuickDocTest | Test Profesional de Velocidad de Mecanografía',
    description:
      'Mide velocidad, precisión y rendimiento de mecanografía con métricas reconocidas internacionalmente y certificación digital.',
  },
};

export const PUBLIC_ROUTES = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.5' },
  { path: '/instructions', changefreq: 'monthly', priority: '0.7' },
  { path: '/compress-pdf', changefreq: 'monthly', priority: '0.7' },
  { path: '/merge-pdf', changefreq: 'monthly', priority: '0.7' },
  { path: '/extract-pdf-text', changefreq: 'monthly', priority: '0.7' },
];
