/** Patente no certificado — título traduzido, sem textos entre parênteses */
export function getCertificateRankLabel(results, t) {
  if (t && results?.rankKey) {
    return t(`rank_${results.rankKey}`);
  }

  const legacy = results?.rank || '—';
  return legacy.replace(/\s*\([^)]*\)\s*/g, '').trim() || legacy;
}

export function getCertificateMetrics(results, labels = {}) {
  return {
    hero: [
      { key: 'net', label: 'NET WPM', value: String(results.netWpm ?? 0) },
      { key: 'acc', label: 'ACCURACY', value: `${results.accuracy ?? 0}%` },
      { key: 'cpm', label: 'CPM', value: String(results.cpm ?? 0) },
    ],
    secondary: [
      { label: 'GROSS WPM', value: String(results.grossWpm ?? 0) },
      { label: 'PERFORMANCE', value: String(results.performanceScore ?? 0) },
      { label: labels.latency || 'LATÊNCIA', value: `${results.latenciaMedia ?? 0} ms` },
      { label: labels.consistency || 'CONSISTÊNCIA', value: `${results.consistency ?? 0}%` },
      { label: labels.completion || 'COMPLETUDE', value: `${results.completude ?? 0}%` },
      { label: labels.keystrokes || 'TOQUES', value: String(results.totalToques ?? 0) },
      { label: labels.errors || 'ERROS', value: String(results.permanecem ?? 0) },
    ],
  };
}

/** Serial determinístico baseado no timestamp do resultado (recomputável no futuro) */
export function getCertificateSerial(results) {
  const tsRaw = results?.timestamp;
  const ts = tsRaw ? new Date(tsRaw).getTime() || Date.now() : Date.now();
  const date = new Date(ts);
  const year = date.getUTCFullYear();
  const seq = String(ts % 1000000).padStart(6, '0');
  return `QDT-${year}-${seq}`;
}

export function getCertificateMetricsRows(results, labels = {}) {
  const m = getCertificateMetrics(results, labels);
  return [
    ...m.hero.map((h) => ({ metric: h.label, result: h.value })),
    ...m.secondary.map((g) => ({ metric: g.label, result: g.value })),
  ];
}

export function formatAchievementLevel(results, t) {
  return getCertificateRankLabel(results, t);
}
