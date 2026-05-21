/** Data formatada conforme idioma do site */
export function getLegalUpdatedDate(lang = 'pt') {
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es' : 'en-US';
  return new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const SITE_SEO_DESCRIPTION =
  'Teste sua velocidade e precisão de digitação com certificação digital QuickDocTest.';

export const CERT_SITE_URL = 'www.quickdoctest.com';
