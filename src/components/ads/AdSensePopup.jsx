import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import AdSenseSlot from './AdSenseSlot';

const CLOSE_DELAY_SEC = 5;

function AdSensePopupInner({ secondsLeft, onClose, themeStyles }) {
  const { t } = useI18n();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const canClose = tick >= CLOSE_DELAY_SEC;
  const closeCountdown = Math.max(0, CLOSE_DELAY_SEC - tick);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-sm border-0 p-0 cursor-pointer"
        onClick={canClose ? onClose : undefined}
        disabled={!canClose}
        aria-label={canClose ? t('adPopupClose') : undefined}
        tabIndex={canClose ? 0 : -1}
      />

      <motion.div
        style={themeStyles?.card}
        className="relative z-10 w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden pointer-events-auto"
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/5">
          <h2 id="ad-popup-title" className="qd-ad-popup-title text-sm font-semibold tracking-tight">
            {t('adPopupTitle')}
          </h2>
          {canClose ? (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label={t('adPopupClose')}
            >
              <X size={18} />
            </button>
          ) : (
            <span className="text-[10px] font-mono qd-text-subtle tabular-nums">
              {t('adPopupWait', { seconds: closeCountdown })}
            </span>
          )}
        </div>

        <div className="px-5 py-3">
          <p className="text-xs qd-text-readable mb-3">{t('adLabel')}</p>
          <AdSenseSlot minHeight={200} className="rounded-xl overflow-hidden" />
        </div>

        <div className="px-5 pb-5">
          <div className="w-full h-1.5 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${((15 - secondsLeft) / 15) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs font-mono mt-2 qd-text-readable tabular-nums">
            {t('loadingCountdown', { seconds: secondsLeft })}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdSensePopup({ open, secondsLeft, onClose, themeStyles }) {
  if (!open) return null;

  return createPortal(
    <AdSensePopupInner
      secondsLeft={secondsLeft}
      onClose={onClose}
      themeStyles={themeStyles}
    />,
    document.body,
  );
}

export default memo(AdSensePopup);
