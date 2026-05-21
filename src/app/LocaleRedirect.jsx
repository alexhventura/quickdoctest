import { Navigate } from 'react-router-dom';
import { detectLanguage } from '@/i18n';

/** Redireciona `/` para o idioma detectado (`/pt`, `/en` ou `/es`). */
export default function LocaleRedirect() {
  const lang = detectLanguage();
  return <Navigate to={`/${lang}`} replace />;
}
