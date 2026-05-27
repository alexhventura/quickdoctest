import { memo, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CHART_WIDTH = 400;
const CHART_HEIGHT = 250;

function SpeedChart({ chartData, title, themeStyles }) {
  const isDark = themeStyles?.isDark;
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const strokeColor = '#2563eb';

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}`,
      borderRadius: 8,
      fontSize: 12,
    }),
    [isDark],
  );

  const safeData = Array.isArray(chartData) && chartData.length > 0 ? chartData : [{ second: 0, WPM: 0 }];

  return (
    <div
      style={{ ...themeStyles.card, minHeight: CHART_HEIGHT + 72 }}
      className="border p-6 rounded-2xl shadow-sm transition-colors duration-300"
    >
      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-4">{title}</div>
      <div style={{ width: '100%', minWidth: CHART_WIDTH, height: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT} minWidth={CHART_WIDTH}>
          <AreaChart
            data={safeData}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
          >
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
    </div>
  );
}

export default memo(SpeedChart);
