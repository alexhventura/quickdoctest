import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { getThemeStyles } from '@/lib/theme';
import { useSeo } from '@/hooks/useSeo';
import { useLocalePath } from '@/hooks/useLocalePath';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function SeoLandingLayout({ title, description, h1, intro, bullets, faqItems }) {
  const { lang, theme } = useAppStore();
  const { home } = useLocalePath();
  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);

  useSeo({
    lang,
    title,
    description,
    faqItems,
  });

  return (
    <div
      style={themeStyles.root}
      className="min-h-screen font-sans flex flex-col transition-colors duration-300"
    >
      <Header themeStyles={themeStyles} />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:px-6">
        <article
          style={themeStyles.card}
          className="rounded-2xl border border-slate-200/70 dark:border-white/10 p-6 sm:p-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {h1}
          </h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">{intro}</p>

          <section className="mt-8" aria-label="Feature highlights">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Why use it</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              {bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8" aria-label="Call to action">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Get started</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              QuickDocTest is actively expanding its PDF toolkit while keeping performance and
              privacy first.
            </p>
            <Link
              to={home}
              className="inline-flex mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Open QuickDocTest
            </Link>
          </section>
        </article>
      </main>
      <Footer themeStyles={themeStyles} />
    </div>
  );
}

export default memo(SeoLandingLayout);
