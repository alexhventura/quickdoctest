import { memo } from 'react';
import { useI18n } from '@/contexts/I18nContext';

function RankBanner({ results }) {
  const { t } = useI18n();
  const rankKey = results.rankKey || 'incipient';

  return (
    <div
      className={`mx-auto max-w-xl p-4 rounded-2xl border text-center shadow-sm transition-all duration-300 ${results.rankStyle}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-[0.2em] qd-rank-label">
        {t('rankBannerTitle')}
      </div>
      <div className="text-xl font-black mt-0.5 tracking-wide">{t(`rank_${rankKey}`)}</div>
      <div className="text-xs mt-2 qd-rank-desc font-sans leading-relaxed px-4">
        {t(`rankPercentile_${rankKey}`)}
      </div>
    </div>
  );
}

export default memo(RankBanner);
