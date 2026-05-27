import { memo, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { getThemeStyles } from '@/lib/theme';
import { useSeo } from '@/hooks/useSeo';
import { getSeoRelatedLinks } from '@/constants/seoPages';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function SeoContentLayout({ page }) {
  const { theme, setLang } = useAppStore();
  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);
  const homeHref = `/${page.lang}`;
  const related = useMemo(() => getSeoRelatedLinks(page.slug, page.lang), [page.slug, page.lang]);

  useEffect(() => {
    if (page.lang) setLang(page.lang);
  }, [page.lang, setLang]);

  useSeo({
    lang: page.lang,
    title: page.title,
    description: page.description,
    faqItems: page.faq,
    canonicalPath: `/${page.slug}`,
  });

  const ctaLabel =
    page.lang === 'pt'
      ? 'Iniciar teste de digitação'
      : page.lang === 'es'
        ? 'Iniciar prueba de mecanografía'
        : 'Start typing test';

  const relatedTitle =
    page.lang === 'pt' ? 'Páginas relacionadas' : page.lang === 'es' ? 'Páginas relacionadas' : 'Related pages';

  return (
    <div
      style={themeStyles.root}
      className="min-h-screen font-sans flex flex-col transition-colors duration-300"
    >
      <Header themeStyles={themeStyles} />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:px-6">
        <article
          style={themeStyles.card}
          className="qd-mobile-seo rounded-2xl border border-slate-200/70 dark:border-white/10 p-6 sm:p-8 shadow-sm"
        >
          <h1 className="qd-mobile-seo__title text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {page.h1}
          </h1>
          <p className="qd-mobile-seo__body mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
            {page.intro}
          </p>

          {page.sections.map((section) => (
            <section key={section.h2} className="mt-8">
              <h2 className="qd-mobile-seo__title text-xl font-semibold text-slate-900 dark:text-white">
                {section.h2}
              </h2>
              {section.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 48)}
                  className="qd-mobile-seo__body mt-3 leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {para}
                </p>
              ))}
              {section.subsections?.map((sub) => (
                <div key={sub.h3} className="mt-5">
                  <h3 className="qd-mobile-seo__lead text-base font-semibold text-slate-800 dark:text-slate-200">
                    {sub.h3}
                  </h3>
                  {sub.paragraphs.map((para) => (
                    <p
                      key={para.slice(0, 48)}
                      className="qd-mobile-seo__body mt-2 leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          ))}

          <section className="mt-10" aria-label="Call to action">
            <h2 className="qd-mobile-seo__title text-xl font-semibold">
              {page.lang === 'pt' ? 'Faça seu teste agora' : 'Take the test now'}
            </h2>
            <p className="qd-mobile-seo__body mt-2 leading-relaxed">
              {page.lang === 'pt'
                ? 'Use o teste principal do QuickDocTest para medir WPM, precisão e emitir certificado.'
                : 'Use the main QuickDocTest app to measure WPM, accuracy, and download your certificate.'}
            </p>
            <Link
              to={homeHref}
              className="inline-flex mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {ctaLabel}
            </Link>
          </section>

          <nav className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10" aria-label={relatedTitle}>
            <h2 className="qd-mobile-seo__title text-lg font-semibold">{relatedTitle}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={link.href}
                    className="qd-mobile-seo__body text-sm font-medium hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <Footer themeStyles={themeStyles} />
    </div>
  );
}

export default memo(SeoContentLayout);
