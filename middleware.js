/**
 * Edge: redireciona / com Accept-Language e apex → www (antes do HTML).
 * Lógica alinhada a src/utils/locale/detectBrowserLanguage.js
 */
function languageFromAcceptLanguage(header) {
  const primary = (header || 'en').split(',')[0].trim().toLowerCase();
  if (primary.startsWith('pt')) return 'pt';
  if (primary.startsWith('es')) return 'es';
  return 'en';
}

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === 'quickdoctest.com') {
    url.hostname = 'www.quickdoctest.com';
    return Response.redirect(url.toString(), 308);
  }

  if (url.pathname === '/' || url.pathname === '') {
    const lang = languageFromAcceptLanguage(
      request.headers.get('accept-language'),
    );
    url.pathname = `/${lang}`;
    return Response.redirect(url.toString(), 307);
  }
}

export const config = {
  matcher: ['/'],
};
