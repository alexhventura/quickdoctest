import { memo } from 'react';
import { useI18n } from '@/contexts/I18nContext';

function MobileTypingSeoSection({ className = '' }) {
  const { t } = useI18n();

  return (
    <section
      className={`qd-mobile-seo mt-8 rounded-2xl border p-5 sm:p-6 shadow-sm ${className}`}
      aria-labelledby="mobile-typing-seo-title"
    >
      <h2
        id="mobile-typing-seo-title"
        className="qd-mobile-seo__title text-lg sm:text-xl font-bold"
      >
        {t('seoMobileTitle')}
      </h2>
      <p className="qd-mobile-seo__lead mt-2 text-sm font-semibold">
        {t('seoMobileLead')}
      </p>
      <p className="qd-mobile-seo__body mt-3 text-sm leading-relaxed">
        {t('seoMobileBody')}
      </p>
      <ul className="qd-mobile-seo__list mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <li className="qd-mobile-seo__item flex items-start gap-2">
          <span className="qd-mobile-seo__bullet mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
          {t('seoMobileBullet1')}
        </li>
        <li className="qd-mobile-seo__item flex items-start gap-2">
          <span className="qd-mobile-seo__bullet mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
          {t('seoMobileBullet2')}
        </li>
        <li className="qd-mobile-seo__item flex items-start gap-2">
          <span className="qd-mobile-seo__bullet mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
          {t('seoMobileBullet3')}
        </li>
        <li className="qd-mobile-seo__item flex items-start gap-2">
          <span className="qd-mobile-seo__bullet mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
          {t('seoMobileBullet4')}
        </li>
      </ul>
    </section>
  );
}

export default memo(MobileTypingSeoSection);
