import {
  getCertificateMetrics,
  getCertificateRankLabel,
} from '@/utils/certificate/certificateMetrics';

export function buildCertificateCopy(t, results) {
  const rankLabel = getCertificateRankLabel(results, t);
  return {
    brandTitle: t('certBrandTitle'),
    title: t('certTitle'),
    standard: t('certStandard', {
      duration: results.testDuration,
      lang: t(`lang_${results.testLang}`),
    }),
    subtitle: t('certSubtitle'),
    rankLabel,
    rankLine: t('certRankLine', { rank: rankLabel }),
    metricsTitle: t('certMetricsTitle'),
    metrics: getCertificateMetrics(results, {
      keystrokes: t('certLabelKeystrokes'),
      errors: t('certLabelErrors'),
      latency: t('certLabelLatency'),
      consistency: t('certLabelConsistency'),
      completion: t('certLabelCompletion'),
    }),
    anonymous: t('certAnonymous'),
    auth: t('certAuth'),
    issuedOn: t('certIssuedOn', { date: results.timestamp || '—' }),
    durationLabel: `${t('testDurationLabel')} · ${results.testDuration || 30}s`,
    siteUrl: t('certSiteUrl'),
  };
}
