import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LANGUAGE_CODES } from '@/constants/languages';
import { useAppStore } from '@/store/appStore';

export function stripLocalePrefix(pathname) {
  const match = pathname.match(/^\/(pt|en|es)(\/|$)/);
  if (!match) return pathname === '/' ? '' : pathname;
  const rest = pathname.slice(match[1].length + 1);
  return rest || '';
}

/** Caminhos localizados (`/en/terms`, etc.) com fallback para idioma do store. */
export function useLocalePath() {
  const { lang: paramLang } = useParams();
  const { lang: storeLang } = useAppStore();
  const lang = LANGUAGE_CODES.includes(paramLang) ? paramLang : storeLang;

  return useMemo(
    () => ({
      lang,
      home: `/${lang}`,
      terms: `/${lang}/terms`,
      privacy: `/${lang}/privacy`,
      instructions: `/${lang}/instructions`,
    }),
    [lang],
  );
}
