import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  buildLocalePath,
  languageFromTag,
} from '@/utils/locale/detectBrowserLanguage';

/**
 * Redireciona "/" → /pt, /en ou /es conforme navigator.language.
 * Montado apenas na rota raiz — não redireciona de /pt|/en|/es (sem loop).
 */
export default function LocaleRedirect() {
  const { search, hash } = useLocation();

  const to = useMemo(() => {
    const tag =
      typeof navigator !== 'undefined'
        ? navigator.language || navigator.languages?.[0] || 'en'
        : 'en';
    const lang = languageFromTag(tag);
    return buildLocalePath(lang, { search, hash });
  }, [search, hash]);

  return <Navigate to={to} replace />;
}
