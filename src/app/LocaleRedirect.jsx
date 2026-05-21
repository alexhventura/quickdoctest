import { Navigate, useLocation } from 'react-router-dom';
import {
  buildLocalePath,
  detectBrowserLanguage,
  shouldRedirectFromRoot,
} from '@/utils/locale/detectBrowserLanguage';

/** Fallback React: `/` → `/{lang}` (o redirect principal ocorre antes no HTML/edge). */
export default function LocaleRedirect() {
  const { pathname, search, hash } = useLocation();

  if (!shouldRedirectFromRoot(pathname)) {
    return <Navigate to="/en" replace />;
  }

  const lang = detectBrowserLanguage({ preferStored: true });
  return <Navigate to={buildLocalePath(lang, { search, hash })} replace />;
}
