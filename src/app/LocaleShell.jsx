import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { LANGUAGE_CODES } from '@/constants/languages';
import { useAppStore } from '@/store/appStore';

/** Sincroniza `:lang` da URL com i18n e renderiza rotas filhas. */
export default function LocaleShell() {
  const { lang } = useParams();
  const { setLang } = useAppStore();

  useEffect(() => {
    if (LANGUAGE_CODES.includes(lang)) {
      setLang(lang);
    }
  }, [lang, setLang]);

  if (!LANGUAGE_CODES.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return <Outlet />;
}
