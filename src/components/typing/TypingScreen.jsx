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

  const isMobileLike = Boolean(deviceProfile?.isMobileLike);
  const { keyboardOpen } = useMobileKeyboardOffset(isMobileLike);

  useEffect(() => {
    if (!keyboardOpen) return;
    typingAreaRef?.current?.syncLayout?.();
  }, [keyboardOpen, typingAreaRef]);

  const shellClass = [
    'qd-test-shell',
    focusMode ? 'qd-test-shell--active' : '',
    isMobileLike ? 'qd-test-shell--mobile' : '',
    keyboardOpen ? 'qd-test-shell--keyboard-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const focusClass = keyboardOpen
    ? 'qd-mobile-keyboard-focus qd-mobile-keyboard-focus--active'
    : 'qd-mobile-keyboard-focus';

  return (
    <div className={shellClass}>
      <div className={`qd-test-shell-controls${keyboardOpen ? ' qd-test-shell-controls--hidden' : ''}`}>
        <div className="flex flex-col items-center gap-1 mb-3">
          <DurationSelector duration={duration} onSelect={onDurationChange} />
          {textMeta && (
            <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 tabular-nums">
              {t(DURATION_SPECS[duration]?.labelKey)} · {textMeta.words} {t('textWords')} ·{' '}
              {textMeta.chars} {t('textChars')}
            </p>
          )}
        </div>
      </div>

      <div className={focusClass}>
        <TypingHUD
          wpmRef={hudWpmRef}
          accRef={hudAccRef}
          timerRef={hudTimerRef}
          labels={labels}
          compact={isMobileLike}
        />

        <div className="qd-mobile-test-container">
          <TypingArea
            ref={typingAreaRef}
            isDark={isDark}
            isMobile={isMobileLike}
            keyboardOpen={keyboardOpen}
            onNativeInput={onNativeInput}
            onFocusArea={() => {
              onFocusInputArea?.();
              typingAreaRef.current?.focus?.();
            }}
          />
        </div>
      </div>

      <p className={`qd-test-hint select-none${keyboardOpen ? ' qd-test-hint--hidden' : ''}`}>
        {labels.tabHint}
      </p>
    </div>
  );
}

export default memo(TypingScreen);
