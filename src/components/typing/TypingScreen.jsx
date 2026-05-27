import { memo, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/contexts/I18nContext';
import { getTextMeta } from '@/constants/texts';
import { DURATION_SPECS } from '@/constants/typingSpecs';
import { useMobileKeyboardOffset } from '@/hooks/useMobileKeyboardOffset';
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

  const isMobilePhone = Boolean(deviceProfile?.isMobile);
  const isMobileLike = Boolean(deviceProfile?.isMobileLike);
  const { keyboardOpen } = useMobileKeyboardOffset(isMobilePhone);

  useEffect(() => {
    if (!keyboardOpen) return;
    typingAreaRef?.current?.syncLayout?.();
  }, [keyboardOpen, typingAreaRef]);

  return (
    <div
      className={`qd-test-shell ${
        focusMode ? 'qd-test-shell--active' : ''
      } ${isMobileLike ? 'qd-test-shell--mobile' : ''}${
        isMobileLike && keyboardOpen ? ' qd-test-shell--keyboard-open' : ''
      }`}
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
        compact={isMobileLike}
      />

      {/* INPUT AREA (CORE) */}
      <div className={`relative${isMobilePhone ? ' qd-mobile-test-container' : ''}`}>
        <TypingArea
          ref={typingAreaRef}
          isDark={isDark}
          isMobile={isMobilePhone}
          keyboardOpen={keyboardOpen}
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