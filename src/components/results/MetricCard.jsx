import { memo } from 'react';

function MetricCard({ label, value, detail, hoverClass, valueClass, themeStyles }) {
  const card = (
    <div
      style={themeStyles.card}
      className={`border p-4 rounded-xl text-center shadow-sm ${hoverClass} transition-all`}
    >
      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">{label}</div>
      <span className={`text-4xl font-black ${valueClass} mt-1 block`}>{value}</span>
      <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">{detail}</div>
    </div>
  );
  return card;
}

export default memo(MetricCard);
