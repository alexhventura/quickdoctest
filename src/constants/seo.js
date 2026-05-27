export const SITE_URL = 'https://www.quickdoctest.com';
export const SITE_NAME = 'QuickDocTest';
export const SITE_CATEGORY = 'EducationalApplication';
export const SITE_LOGO = `${SITE_URL}/favicon.svg`;

export const DEFAULT_TITLE = 'Mobile Typing Speed Test | QuickDocTest - WPM & Accuracy';
export const DEFAULT_DESCRIPTION =
  'Free mobile typing speed test. Measure WPM, accuracy and performance on your smartphone with an optimized virtual keyboard layout. Works on mobile and desktop.';
export const DEFAULT_KEYWORDS = [
  'typing speed test',
  'mobile typing speed test',
  'typing test mobile',
  'wpm test',
  'typing accuracy',
  'typing certification',
  'QuickDocTest',
  'teste de digitação no celular',
  'teste de velocidade no celular',
  'teste de digitacao mobile',
  'prueba de mecanografia movil',
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
    title: 'Teste de Digitação no Celular | QuickDocTest - Velocidade e Precisão Mobile',
    description:
      'Teste de digitação no celular grátis. Meça sua velocidade (WPM), precisão e desempenho diretamente no smartphone. Compatível com mobile e desktop.',
  },
  en: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  es: {
    title: 'Test de Mecanografía en el Móvil | QuickDocTest - Velocidad y Precisión',
    description:
      'Test de mecanografía en el móvil gratis. Mide WPM, precisión y rendimiento en tu smartphone con teclado virtual optimizado. Compatible con móvil y escritorio.',
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
