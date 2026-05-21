export function averageLatency(latencies) {
  if (!latencies.length) return 0;
  return Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length);
}
