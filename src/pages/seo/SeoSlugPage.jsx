import { Navigate } from 'react-router-dom';
import SeoContentLayout from '@/components/seo/SeoContentLayout';
import { getSeoPage } from '@/constants/seoPages';

export default function SeoSlugPage({ slug }) {
  const page = getSeoPage(slug);

  if (!page) {
    return <Navigate to="/en" replace />;
  }

  return <SeoContentLayout page={page} />;
}
