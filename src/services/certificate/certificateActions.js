import { downloadCertificatePdfFile } from '@/lib/certificatePdf';
import { generateValidationUrl } from '@/utils/formatting/validationUrl';
import { sendCertificateEmail } from '@/services/email/sendCertificateEmail';
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
    validationHint: 'Store this serial with your test ID to verify in the future.',
    siteUrl: t('certSiteUrl'),
  };
}

export async function actionDownloadPdf({ user, results, copy }) {
  await downloadCertificatePdfFile({ user, results, copy });
  return { ok: true, action: 'download' };
}

export async function actionSendEmail({ user, results, lang }) {
  if (!user?.email) {
    return { ok: false, reason: 'no_email' };
  }

  const res = await sendCertificateEmail({ user, results, lang });
  return { ...res, action: 'email' };
}

export async function actionShareLink({ results, user, copy }) {
  const url = generateValidationUrl(results, user);
  const shareText = copy?.shareText || '';
  const shareTitle = copy?.shareTitle || 'QuickDoc Test';

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url,
      });
      return { ok: true, action: 'share', method: 'native' };
    } catch (err) {
      if (err?.name === 'AbortError') {
        return { ok: false, reason: 'cancelled' };
      }
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return { ok: true, action: 'share', method: 'clipboard', url };
  }

  return { ok: false, reason: 'clipboard_unavailable' };
}
