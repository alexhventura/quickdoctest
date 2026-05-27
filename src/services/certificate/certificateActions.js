import { downloadCertificatePdfFile } from '@/lib/certificatePdf';
import { generateValidationUrl } from '@/utils/formatting/validationUrl';
import { sendCertificateEmail } from '@/services/email/sendCertificateEmail';
import { buildCertificateCopy } from '@/services/certificate/certificateCopy';
import { getCertificateRankLabel } from '@/utils/certificate/certificateMetrics';

export { buildCertificateCopy };

export async function actionDownloadPdf({ user, results, copy }) {
  await downloadCertificatePdfFile({ user, results, copy });
  return { ok: true, action: 'download' };
}

export async function actionSendEmail({ user, results, lang, copy }) {
  if (!user?.email) {
    return { ok: false, reason: 'no_email' };
  }

  const res = await sendCertificateEmail({ user, results, lang, copy });
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

export function buildShareCopy(t, results, user) {
  return {
    shareTitle: t('certShareTitle'),
    shareText: t('certShareText', {
      name: user?.name || t('certAnonymous'),
      wpm: results.netWpm,
      rank: getCertificateRankLabel(results, t),
    }),
  };
}
