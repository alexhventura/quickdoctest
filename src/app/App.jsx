import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AnalyticsBootstrap from '@/components/analytics/AnalyticsBootstrap';
import LocaleRedirect from '@/app/LocaleRedirect';
import LocaleShell from '@/app/LocaleShell';
import QuickDocApp from '@/app/QuickDocApp';
import TermsOfUse from '@/pages/legal/TermsOfUse';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TestInstructions from '@/pages/legal/TestInstructions';
import CompressPdfPage from '@/pages/seo/CompressPdfPage';
import MergePdfPage from '@/pages/seo/MergePdfPage';
import ExtractPdfTextPage from '@/pages/seo/ExtractPdfTextPage';
import SeoSlugPage from '@/pages/seo/SeoSlugPage';
import { SEO_PAGE_SLUGS } from '@/constants/seoPages';

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

        {SEO_PAGE_SLUGS.map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<SeoSlugPage slug={slug} />} />
        ))}

        <Route path="/:lang" element={<LocaleShell />}>
          <Route index element={<QuickDocApp />} />
          <Route path="terms" element={<TermsOfUse />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="instructions" element={<TestInstructions />} />
          <Route path="compress-pdf" element={<CompressPdfPage />} />
          <Route path="merge-pdf" element={<MergePdfPage />} />
          <Route path="extract-pdf-text" element={<ExtractPdfTextPage />} />
          {SEO_PAGE_SLUGS.map((slug) => (
            <Route key={`${slug}-localized`} path={slug} element={<SeoSlugPage slug={slug} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
