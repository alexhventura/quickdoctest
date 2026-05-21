import { memo } from 'react';
import { useI18n } from '@/contexts/I18nContext';

function MetricCell({ label, value, sub, themeStyles, accent }) {
  return (
    <div
      style={themeStyles?.root}
      className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 transition-colors"
    >
      <div className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className={`text-lg font-bold font-mono tabular-nums ${accent || 'text-slate-800 dark:text-zinc-100'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function OfficialMetricsGrid({ results, themeStyles }) {
  const { t } = useI18n();

  const cells = [
    { label: t('grossWpm'), value: results.grossWpm, sub: t('grossWpmDetail'), accent: 'text-slate-600 dark:text-zinc-300' },
    { label: t('avgWpm'), value: results.avgWpm, sub: t('avgWpmDetail'), accent: 'text-indigo-500' },
    { label: t('cpm'), value: results.cpm, sub: t('cpmDetail'), accent: 'text-cyan-600' },
    { label: t('adjustedAccuracy'), value: `${results.adjustedAccuracy}%`, sub: t('adjustedAccDetail'), accent: 'text-teal-600' },
    { label: t('efficiencyFactor'), value: `${results.efficiencyFactor}%`, sub: t('efficiencyDetail'), accent: 'text-violet-500' },
    { label: t('errorRate'), value: results.errorRate, sub: t('errorRateDetail'), accent: 'text-red-500' },
    { label: t('wpmStdDev'), value: results.wpmStdDev, sub: t('wpmStdDevDetail'), accent: 'text-orange-500' },
    { label: t('performanceScore'), value: results.performanceScore, sub: t('performanceScoreDetail'), accent: 'text-amber-500' },
    { label: t('correctWords'), value: `${results.correctWords}/${results.targetWords}`, sub: t('correctWordsDetail') },
    { label: t('testDurationLabel'), value: `${results.testDuration}s`, sub: t('elapsedTime', { seconds: results.elapsedSeconds }) },
  ];

  return (
    <div
      style={themeStyles?.card}
      className="border p-5 rounded-2xl shadow-sm space-y-3 transition-colors duration-300"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {t('officialMetricsTitle')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cells.map((cell) => (
          <MetricCell key={cell.label} {...cell} themeStyles={themeStyles} />
        ))}
      </div>
    </div>
  );
}

export default memo(OfficialMetricsGrid);
