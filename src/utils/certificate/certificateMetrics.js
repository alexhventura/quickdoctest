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
