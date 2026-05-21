import { memo, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

function SpeedChart({ chartData, title, themeStyles }) {
  const isDark = themeStyles?.isDark;
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const strokeColor = '#2563eb';

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: isDark ? '#18181b' : '#fff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'}`,
      borderRadius: 8,
      fontSize: 12,
    }),
    [isDark],
  );

  return (
    <div
      style={themeStyles.card}
      className="border p-6 rounded-2xl shadow-sm h-56 transition-colors duration-300"
    >
      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-4">{title}</div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
          <XAxis dataKey="second" stroke={axisColor} fontSize={11} />
          <YAxis stroke={axisColor} fontSize={11} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="WPM"
            stroke={strokeColor}
            strokeWidth={3}
            fill={strokeColor}
            fillOpacity={0.08}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SpeedChart);
