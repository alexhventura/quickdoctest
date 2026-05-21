import { memo } from 'react';
import { TEST_DURATIONS } from '@/constants/rankings';
import { DURATION_SPECS } from '@/constants/typingSpecs';
import { useI18n } from '@/contexts/I18nContext';

function DurationSelector({ duration, onSelect }) {
  const { t } = useI18n();

  return (
    <div className="qd-duration-group" role="group" aria-label={t('duration')}>
      {TEST_DURATIONS.map((seconds) => (
        <button
          key={seconds}
          type="button"
          onClick={() => onSelect(seconds)}
          className={`qd-duration-btn ${duration === seconds ? 'qd-duration-btn--active' : ''}`}
          title={t(DURATION_SPECS[seconds]?.labelKey || 'duration')}
          aria-pressed={duration === seconds}
        >
          {seconds}s
        </button>
      ))}
    </div>
  );
}

export default memo(DurationSelector);
