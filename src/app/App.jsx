import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AnalyticsBootstrap from '@/components/analytics/AnalyticsBootstrap';
import LocaleRedirect from '@/app/LocaleRedirect';
import LocaleShell from '@/app/LocaleShell';
import QuickDocApp from '@/app/QuickDocApp';
import TermsOfUse from '@/pages/legal/TermsOfUse';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TestInstructions from '@/pages/legal/TestInstructions';

const LEGACY_REDIRECTS = [
  ['terms', 'terms'],
  ['privacy', 'privacy'],
  ['instructions', 'instructions'],
];

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsBootstrap />
      <Routes>
        {/* Raiz: idioma do navegador → /pt | /en | /es */}
        <Route path="/" element={<LocaleRedirect />} />

        {/* Legado antes de /:lang para não capturar "terms" como idioma */}
        {LEGACY_REDIRECTS.map(([from, to]) => (
          <Route
            key={from}
            path={`/${from}`}
            element={<Navigate to={`/en/${to}`} replace />}
          />
        ))}

        <Route path="/:lang" element={<LocaleShell />}>
          <Route index element={<QuickDocApp />} />
          <Route path="terms" element={<TermsOfUse />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="instructions" element={<TestInstructions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
