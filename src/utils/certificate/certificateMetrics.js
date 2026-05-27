/** Patente no certificado — título traduzido, sem textos entre parênteses */
export function getCertificateRankLabel(results, t) {
  if (t && results?.rankKey) {
    return t(`rank_${results.rankKey}`);
  }

  const legacy = results?.rank || '—';
  return legacy.replace(/\s*\([^)]*\)\s*/g, '').trim() || legacy;
}

/** Cards planos para o grid do certificado (valor + label) */
export function getCertificateMetricCards(results, labels = {}) {
  return [
    { key: 'net', label: 'NET WPM', value: String(results?.netWpm ?? 0) },
    { key: 'acc', label: 'ACCURACY', value: `${results?.accuracy ?? 0}%` },
    { key: 'cpm', label: 'CPM', value: String(results?.cpm ?? 0) },
    { key: 'gross', label: 'GROSS WPM', value: String(results?.grossWpm ?? 0) },
    { key: 'perf', label: 'PERFORMANCE', value: String(results?.performanceScore ?? 0) },
    {
      key: 'latency',
      label: labels.latency || 'LATÊNCIA',
      value: `${results?.latenciaMedia ?? 0} ms`,
    },
    {
      key: 'consistency',
      label: labels.consistency || 'CONSISTÊNCIA',
      value: `${results?.consistency ?? 0}%`,
    },
    {
      key: 'completion',
      label: labels.completion || 'COMPLETUDE',
      value: `${results?.completude ?? 0}%`,
    },
    {
      key: 'keystrokes',
      label: labels.keystrokes || 'TOQUES',
      value: String(results?.totalToques ?? 0),
    },
    {
      key: 'errors',
      label: labels.errors || 'ERROS',
      value: String(results?.permanecem ?? 0),
    },
  ];
}

export function getCertificateMetrics(results, labels = {}) {
  const cards = getCertificateMetricCards(results, labels);
  return {
    hero: cards.slice(0, 3),
    secondary: cards.slice(3).map(({ label, value }) => ({ label, value })),
    cards,
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
  return getCertificateMetricCards(results, labels).map(({ label, value }) => ({
    metric: label,
    result: value,
  }));
}

export function formatAchievementLevel(results, t) {
  return getCertificateRankLabel(results, t);
}
