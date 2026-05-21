import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import AdSenseSlot from '@/components/ads/AdSenseSlot';

function LoadingScreen({
  themeStyles,
  loadingProgress,
  loadingSecondsLeft,
  emailStatus,
  user,
}) {
  const { t } = useI18n();

  return (
    <div
      style={themeStyles?.card}
      className="border p-6 sm:p-8 rounded-2xl shadow-sm text-center space-y-6 transition-colors duration-300"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex justify-center"
      >
        <Loader2
          className="w-10 h-10 text-blue-500 animate-spin"
          aria-hidden
        />
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">{t('loading')}</h2>
        <p className="text-sm qd-text-readable">{t('loadingSubtitle')}</p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <div className="w-full h-2.5 bg-slate-200/30 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
            style={{ width: `${loadingProgress}%` }}
            layout
          />
        </div>
        <div className="flex justify-between text-xs font-mono qd-text-readable tabular-nums">
          <span>{Math.round(loadingProgress)}%</span>
          <span>{t('loadingCountdown', { seconds: loadingSecondsLeft })}</span>
        </div>
      </div>

      {user?.email && <EmailStatusBanner status={emailStatus} email={user.email} />}

      <div className="pt-2">
        <p className="text-[10px] uppercase tracking-wider qd-text-subtle mb-2">
          {t('adLabel')}
        </p>
        <AdSenseSlot minHeight={120} className="rounded-xl" />
      </div>
    </div>
  );
}

function EmailStatusBanner({ status, email }) {
  const { t } = useI18n();

  if (!status) return null;

  const config = {
    sending: {
      icon: Mail,
      className: 'text-blue-400',
      text: t('emailSending'),
      spin: true,
    },
    sent: {
      icon: CheckCircle2,
      className: 'text-emerald-400',
      text: t('emailSent', { email }),
    },
    failed: {
      icon: AlertCircle,
      className: 'text-amber-400',
      text: t('emailFailed'),
    },
  };

  const item = config[status];
  if (!item) return null;

  const Icon = item.icon;

  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center gap-2 text-xs ${item.className}`}
    >
      <Icon
        size={14}
        className={item.spin ? 'animate-pulse' : ''}
        aria-hidden
      />
      {item.text}
    </motion.p>
  );
}

export default memo(LoadingScreen);
