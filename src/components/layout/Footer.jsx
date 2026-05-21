import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useLocalePath } from '@/hooks/useLocalePath';

function Footer({ themeStyles }) {
  const { t } = useI18n();
  const { terms, privacy, instructions } = useLocalePath();

  return (
    <footer
      style={themeStyles.card}
      className="py-5 px-4 text-center border-t border-slate-200 dark:border-transparent transition-colors duration-300"
    >
      <p className="text-xs text-slate-600 dark:text-slate-400">{t('footerRights')}</p>

      <nav
        className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium"
        aria-label="Links institucionais"
      >
        <Link
          to={terms}
          className="text-blue-700 dark:text-blue-400 hover:text-[#863bff] dark:hover:text-violet-300 transition-colors"
        >
          {t('footerTerms')}
        </Link>
        <span className="text-slate-300 dark:text-zinc-600" aria-hidden>
          |
        </span>
        <Link
          to={privacy}
          className="text-blue-700 dark:text-blue-400 hover:text-[#863bff] dark:hover:text-violet-300 transition-colors"
        >
          {t('footerPrivacy')}
        </Link>
        <span className="text-slate-300 dark:text-zinc-600" aria-hidden>
          |
        </span>
        <Link
          to={instructions}
          className="text-blue-700 dark:text-blue-400 hover:text-[#863bff] dark:hover:text-violet-300 transition-colors"
        >
          {t('footerHowItWorks')}
        </Link>
      </nav>
    </footer>
  );
}

export default memo(Footer);
