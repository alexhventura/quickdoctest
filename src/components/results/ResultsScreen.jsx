import { lazy, memo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Award, RotateCcw, Mail, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import CertificateActions from '@/components/certificate/CertificateActions';
import RankBanner from './RankBanner';
import MetricCard from './MetricCard';
import ResultsStatsGrid from './ResultsStatsGrid';
import OfficialMetricsGrid from './OfficialMetricsGrid';

const SpeedChart = lazy(() => import('@/components/charts/SpeedChart'));

function ChartFallback({ themeStyles }) {
  const { t } = useI18n();
  return (
    <div
      style={themeStyles?.card}
      className="border p-6 rounded-2xl shadow-sm h-56 flex items-center justify-center text-xs text-blue-600 dark:text-slate-400 font-mono"
    >
      {t('chartLoading')}
    </div>
  );
}

function ResultsScreen({
  themeStyles,
  results,
  chartData,
  onRepeat,
  onPreviewCertificate,
  emailStatus,
  user,
  lang,
}) {
  const { labels, t } = useI18n();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-3">
        <h2 className="qd-results-title text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-2 text-blue-700 dark:text-white">
          <Award className="text-amber-500" aria-hidden />
          {labels.title}
        </h2>
        <p className="text-sm qd-text-readable">
          {t('testSummary', {
            duration: results.testDuration,
            lang: t(`lang_${results.testLang}`),
          })}
        </p>
        <RankBanner results={results} />
      </div>

      {emailStatus === 'sent' && user?.email && (
        <p className="flex items-center justify-center gap-2 text-sm text-emerald-500">
          <CheckCircle2 size={16} aria-hidden />
          {t('emailSent', { email: user.email })}
        </p>
      )}

      {!user && (
        <p className="text-center text-xs text-amber-500/90 flex items-center justify-center gap-1">
          <Mail size={14} aria-hidden />
          {labels.loginAlert}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          themeStyles={themeStyles}
          label={labels.netWpm}
          value={results.netWpm}
          detail={labels.wpmDetail}
          hoverClass="hover:border-blue-500"
          valueClass="text-blue-600"
        />
        <MetricCard
          themeStyles={themeStyles}
          label={labels.accuracy}
          value={`${results.accuracy}%`}
          detail={labels.accDetail}
          hoverClass="hover:border-emerald-500"
          valueClass="text-emerald-600"
        />
        <MetricCard
          themeStyles={themeStyles}
          label={labels.consistency}
          value={`${results.consistency}%`}
          detail={labels.conDetail}
          hoverClass="hover:border-purple-500"
          valueClass="text-purple-600"
        />
        <MetricCard
          themeStyles={themeStyles}
          label={labels.peakWpm}
          value={results.burstSpeed}
          detail={labels.peakDetail}
          hoverClass="hover:border-amber-500"
          valueClass="text-amber-500"
        />
      </div>

      <OfficialMetricsGrid results={results} themeStyles={themeStyles} />
      <ResultsStatsGrid results={results} themeStyles={themeStyles} />

      <Suspense fallback={<ChartFallback themeStyles={themeStyles} />}>
        <SpeedChart
          chartData={chartData}
          title={labels.chartTitle}
          themeStyles={themeStyles}
        />
      </Suspense>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          type="button"
          onClick={onRepeat}
          className="bg-gray-400 hover:bg-gray-500 text-gray-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100 font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <RotateCcw size={16} aria-hidden />
          {labels.repeatBtn}
        </button>

        <div className="sm:col-span-2">
          <CertificateActions
            results={results}
            user={user}
            lang={lang}
            onPreview={onPreviewCertificate}
          />
        </div>
      </div>

      <p className="text-center text-xs qd-text-subtle pt-2">{labels.shareHint}</p>
    </motion.div>
  );
}

export default memo(ResultsScreen);
