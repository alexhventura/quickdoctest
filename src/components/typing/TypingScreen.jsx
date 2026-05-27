import { memo, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/contexts/I18nContext';
import { getTextMeta } from '@/constants/texts';
import { DURATION_SPECS } from '@/constants/typingSpecs';
import DurationSelector from './DurationSelector';
import TypingArea from './TypingArea';
import TypingHUD from './TypingHUD';

function TypingScreen({
  themeStyles,
  deviceProfile,
  duration,
  onDurationChange,
  typingAreaRef,
  onNativeInput,
  onFocusInputArea,
  focusMode,
  hudWpmRef,
  hudAccRef,
  hudTimerRef,
  targetText,
}) {
  const { labels } = useAppStore();
  const { t } = useI18n();
  const isDark = themeStyles?.isDark;
  const textMeta = useMemo(
    () => (targetText ? getTextMeta(targetText) : null),
    [targetText],
  );

  return (
    <div
      className={`qd-test-shell ${
        focusMode ? 'qd-test-shell--active' : ''
      } ${deviceProfile?.isMobileLike ? 'qd-test-shell--mobile' : ''}`}
    >
      {/* TIMER */}
      <div className="flex flex-col items-center gap-1 mb-3">
        <DurationSelector duration={duration} onSelect={onDurationChange} />
        {textMeta && (
          <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 tabular-nums">
            {t(DURATION_SPECS[duration]?.labelKey)} · {textMeta.words} {t('textWords')} · {textMeta.chars} {t('textChars')}
          </p>
        )}
      </div>

      {/* HUD */}
      <TypingHUD
        wpmRef={hudWpmRef}
        accRef={hudAccRef}
        timerRef={hudTimerRef}
        labels={labels}
        compact={deviceProfile?.isMobileLike}
      />

      {/* INPUT AREA (CORE) */}
      <div className="relative">
        <TypingArea
          ref={typingAreaRef}
          isDark={isDark}
          isMobile={deviceProfile?.isMobileLike}
          onNativeInput={onNativeInput}
          onFocusArea={() => {
            onFocusInputArea?.();
            typingAreaRef.current?.focus?.();
          }}
        />

        {/* CURSOR FIX LAYER (IMPORTANTE PARA BUG VISUAL) */}
        <div
          className="qd-cursor-fix-layer"
          aria-hidden="true"
        />
      </div>

      {/* HINT */}
      <p className="qd-test-hint select-none">
        {labels.tabHint}
      </p>
    </div>
  );
}

export default memo(TypingScreen);