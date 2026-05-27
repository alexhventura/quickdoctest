import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

function StatItem({ label, value, labelClass, valueClass }) {
  return (
    <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <div className={`${labelClass} mb-1`}>{label}</div>
      <span className={`text-base font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function ResultsStatsGrid({ results, themeStyles }) {
  const { t } = useI18n();
  const mobile = results?.mobileMetrics;

  return (
    <div
      style={themeStyles.card}
      className="border p-5 rounded-2xl shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono text-xs transition-colors duration-300"
    >
      <StatItem
        label={`${t('netWpm')} (bruto):`}
        value={results.grossWpm}
        labelClass="text-blue-600 dark:text-slate-400"
        valueClass="qd-stat-value text-black dark:text-zinc-100"
      />
      <StatItem
        label={`${t('statsCompletion')}:`}
        value={`${results.completude}%`}
        labelClass="text-blue-600 dark:text-slate-400"
        valueClass="text-blue-500"
      />
      <StatItem
        label={
          <span className="text-red-400 flex items-center gap-1">
            <AlertTriangle size={12} aria-hidden />
            {t('statsErrors')}:
          </span>
        }
        value={results.permanecem}
        labelClass=""
        valueClass="text-red-500"
      />
      <StatItem
        label={`${t('statsCorrected')}:`}
        value={results.corrigidos}
        labelClass="text-emerald-400"
        valueClass="text-emerald-500"
      />
      <StatItem
        label={`${t('certLatency')}:`}
        value={`${results.latenciaMedia} ms`}
        labelClass="text-amber-400"
        valueClass="text-amber-500"
      />
      {mobile && (
        <StatItem
          label={`${t('mobileSpeed')}:`}
          value={`${mobile.speed} WPM`}
          labelClass="text-violet-400"
          valueClass="text-violet-500"
        />
      )}
      {mobile && (
        <StatItem
          label={`${t('touchAccuracy')}:`}
          value={`${mobile.touchAccuracy}%`}
          labelClass="text-cyan-400"
          valueClass="text-cyan-500"
        />
      )}
      {mobile && (
        <StatItem
          label={`${t('reactionTime')}:`}
          value={`${mobile.reactionMs || 0} ms`}
          labelClass="text-fuchsia-400"
          valueClass="text-fuchsia-500"
        />
      )}
      {mobile && (
        <StatItem
          label={`${t('autocorrectErrors')}:`}
          value={mobile.autoCorrectCount || 0}
          labelClass="text-rose-400"
          valueClass="text-rose-500"
        />
      )}
    </div>
  );
}

export default memo(ResultsStatsGrid);
