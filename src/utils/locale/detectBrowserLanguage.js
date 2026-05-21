/** Códigos de locale suportados nas rotas */
export const LOCALE_CODES = ['pt', 'en', 'es'];

/** Chave localStorage — manter igual a STORAGE_KEYS.lang */
export const LANG_STORAGE_KEY = 'qd_lang';

/**
 * Mapeia tag BCP 47 (pt-BR, es-MX, en-US…) para código de rota.
 * @param {string} tag
 * @returns {'pt'|'en'|'es'}
 */
export function languageFromTag(tag) {
  const lower = (tag || 'en').toLowerCase();
  if (lower.startsWith('pt')) return 'pt';
  if (lower.startsWith('es')) return 'es';
  return 'en';
}

/**
 * Parseia header Accept-Language (servidor / edge).
 * @param {string} header
 * @returns {'pt'|'en'|'es'}
 */
export function languageFromAcceptLanguage(header) {
  const primary = (header || 'en').split(',')[0].trim();
  return languageFromTag(primary);
}

/**
 * Detecta idioma: localStorage (preferência salva) → navigator.language → en.
 * @param {{ preferStored?: boolean }} [options]
 * @returns {'pt'|'en'|'es'}
 */
export function detectBrowserLanguage(options = {}) {
  const { preferStored = true } = options;

  if (preferStored && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (LOCALE_CODES.includes(stored)) return stored;
    } catch {
      /* storage bloqueado */
    }
  }

  if (typeof navigator === 'undefined') return 'en';

  const tag = navigator.language || navigator.languages?.[0] || 'en';
  return languageFromTag(tag);
}

/** @param {string} pathname */
export function isRootPath(pathname) {
  const path = pathname || '/';
  return path === '/' || path === '';
}

/**
 * Indica se a URL atual deve redirecionar da raiz para /{lang}.
 * Evita loop: não redireciona se já estiver em /pt, /en ou /es.
 * @param {string} pathname
 */
export function shouldRedirectFromRoot(pathname) {
  if (!isRootPath(pathname)) return false;
  return true;
}

/**
 * @param {'pt'|'en'|'es'} lang
 * @param {{ search?: string, hash?: string }} [options]
 */
export function buildLocalePath(lang, options = {}) {
  const safe = LOCALE_CODES.includes(lang) ? lang : 'en';
  const { search = '', hash = '' } = options;
  return `/${safe}${search}${hash}`;
}
