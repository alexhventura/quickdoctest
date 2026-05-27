import { memo } from 'react';
import { useI18n } from '@/contexts/I18nContext';

function MobileTypingSeoSection({ className = '' }) {
  const { t } = useI18n();

  return (
    <section
      className={`mt-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 p-5 sm:p-6 shadow-sm ${className}`}
      aria-labelledby="mobile-typing-seo-title"
    >
      <h2
        id="mobile-typing-seo-title"
        className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100"
      >
        {t('seoMobileTitle')}
      </h2>
      <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-400">
        {t('seoMobileLead')}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        {t('seoMobileBody')}
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-zinc-400 sm:grid-cols-2">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
          {t('seoMobileBullet1')}
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
          {t('seoMobileBullet2')}
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
          {t('seoMobileBullet3')}
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
          {t('seoMobileBullet4')}
        </li>
      </ul>
    </section>
  );
}

export default memo(MobileTypingSeoSection);
