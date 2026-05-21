import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/contexts/I18nContext';
import { getThemeStyles } from '@/lib/theme';
import { useSeo } from '@/hooks/useSeo';
import { useLocalePath } from '@/hooks/useLocalePath';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/legal.css';

function LegalPageLayout({ title, subtitle, metaTitle, metaDescription, children }) {
  const { theme, lang } = useAppStore();
  const { t } = useI18n();
  const { home } = useLocalePath();
  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);

  useSeo({
    lang,
    title: metaTitle || `${title} | QuickDocTest`,
    description: metaDescription,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={themeStyles.root}
      className="min-h-screen font-sans flex flex-col transition-colors duration-300"
    >
      <Header themeStyles={themeStyles} />

      <main className="qd-legal-page">
        <div className="qd-legal-inner">
          <Link to={home} className="qd-legal-back">
            <ArrowLeft size={16} aria-hidden />
            {t('legalBackToTest')}
          </Link>

          <article className="qd-legal-card">
            <h1 className="qd-legal-title">{title}</h1>
            {subtitle && <p className="qd-legal-subtitle">{subtitle}</p>}
            <div className="qd-legal-body">{children}</div>
          </article>
        </div>
      </main>

      <Footer themeStyles={themeStyles} />
    </div>
  );
}

export default memo(LegalPageLayout);
