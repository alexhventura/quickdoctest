import emailjs from '@emailjs/browser';
import i18n from '@/i18n';
import { getCertificatePdfBase64, getCertificateFileName } from '@/lib/certificatePdf';
import { buildCertificateCopy } from '@/services/certificate/certificateCopy';
import { generateValidationUrl } from '@/utils/formatting/validationUrl';
import { getCertificateRankLabel } from '@/utils/certificate/certificateMetrics';

function tForLang(lang) {
  return (key, opts) => i18n.t(key, { lng: lang, ...opts });
}

function formatIssuedDate(timestamp, lang) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp);
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildEmailBody({ user, results, lang, issuedDate, hasPdf }) {
  const validationUrl = generateValidationUrl(results, user);
  const rank = getCertificateRankLabel(results, tForLang(lang));
  const attachmentNote = hasPdf
    ? i18n.t('certEmailAttachmentNote', { lng: lang, defaultValue: 'O certificado em PDF está anexado a este e-mail.' })
    : '';

  return [
    `QuickDoc Test — ${i18n.t('certTitle', { lng: lang })}`,
    '',
    `${i18n.t('certSubtitle', { lng: lang })} ${user.name}`,
    `E-mail: ${user.email}`,
    `${i18n.t('certRankLine', { lng: lang, rank })}`,
    '',
    `NET WPM: ${results.netWpm}`,
    `ACCURACY: ${results.accuracy}%`,
    `CPM: ${results.cpm}`,
    '',
    `${i18n.t('certIssuedOn', { lng: lang, date: issuedDate })}`,
    attachmentNote,
    '',
    `${i18n.t('certAuth', { lng: lang, defaultValue: 'Verificação' })}: ${validationUrl}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Envia certificado por e-mail via EmailJS (@emailjs/browser), com PDF em anexo (base64).
 */
export async function sendCertificateEmail({ user, results, lang, copy: copyParam }) {
  if (!user?.email) {
    return { ok: false, reason: 'no_email' };
  }

  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
  const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
  const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

  if (!serviceId || !templateId || !publicKey) {
    return { ok: false, reason: 'not_configured' };
  }

  const t = tForLang(lang);
  const copy = copyParam || buildCertificateCopy(t, results);
  const issuedDate = formatIssuedDate(results.timestamp, lang);
  const validationUrl = generateValidationUrl(results, user);
  const pdfFilename = getCertificateFileName();

  let pdfBase64 = '';
  try {
    pdfBase64 = await getCertificatePdfBase64({ user, results, copy, lang });
  } catch (err) {
    console.error('[QuickDoc] Certificate PDF for email:', err);
  }

  const bodyText = buildEmailBody({
    user,
    results,
    lang,
    issuedDate,
    hasPdf: Boolean(pdfBase64),
  });

  const templateParams = {
    to_email: user.email,
    email: user.email,
    user_email: user.email,
    reply_to: user.email,
    to_name: user.name || 'Participante',
    user_name: user.name || 'Participante',
    name: user.name || 'Participante',
    from_name: 'QuickDoc Test',
    subject: `Certificado QuickDoc — ${results.netWpm} WPM`,
    title: i18n.t('certTitle', { lng: lang }),
    message: bodyText,
    body: bodyText,
    content: bodyText,
    nationality: user.nationality || '—',
    locale: user.locale || lang,
    net_wpm: String(results.netWpm),
    gross_wpm: String(results.grossWpm),
    accuracy: `${results.accuracy}%`,
    consistency: `${results.consistency}%`,
    rank: getCertificateRankLabel(results, t),
    timestamp: results.timestamp || '—',
    issued_date: issuedDate,
    issued_on: i18n.t('certIssuedOn', { lng: lang, date: issuedDate }),
    completude: `${results.completude}%`,
    validation_url: validationUrl,
    link: validationUrl,
    performance_score: String(results.performanceScore ?? '—'),
    test_duration: `${results.testDuration}s`,
    pdf_filename: pdfFilename,
    certificate_pdf: pdfBase64,
    pdf_attachment: pdfBase64,
    attachment_name: pdfFilename,
    attachment_content: pdfBase64,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });

    if (response.status >= 200 && response.status < 300) {
      return { ok: true };
    }

    return { ok: false, reason: 'send_failed', detail: response.text };
  } catch (err) {
    const detail = err?.text || err?.message || String(err);
    console.error('[QuickDoc] EmailJS:', detail, err);

    const lower = detail.toLowerCase();
    if (lower.includes('limit') || lower.includes('rate')) {
      return { ok: false, reason: 'rate_limit', detail };
    }
    if (lower.includes('origin') || lower.includes('cors')) {
      return { ok: false, reason: 'origin_blocked', detail };
    }
    if (lower.includes('template') || lower.includes('variable')) {
      return { ok: false, reason: 'template_error', detail };
    }

    return { ok: false, reason: 'send_failed', detail };
  }
}
