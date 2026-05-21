import emailjs from '@emailjs/browser';
import i18n from '@/i18n';
import { generateValidationUrl } from '@/utils/formatting/validationUrl';

function getRankLabel(results, lang) {
  const key = results.rankKey || 'incipient';
  return i18n.t(`rank_${key}`, { lng: lang });
}

function buildEmailBody({ user, results, lang }) {
  const validationUrl = generateValidationUrl(results, user);
  return [
    `QuickDoc Test — Certificado de digitação`,
    ``,
    `Participante: ${user.name}`,
    `E-mail: ${user.email}`,
    `Idioma: ${lang}`,
    ``,
    `WPM líquido: ${results.netWpm}`,
    `WPM bruto: ${results.grossWpm}`,
    `Precisão: ${results.accuracy}%`,
    `Consistência: ${results.consistency}%`,
    `Completude: ${results.completude}%`,
    `${i18n.t('rankBannerTitle', { lng: lang })}: ${getRankLabel(results, lang)}`,
    `Data: ${results.timestamp}`,
    ``,
    `Verificação: ${validationUrl}`,
  ].join('\n');
}

/**
 * Envia certificado por e-mail via EmailJS (@emailjs/browser).
 */
export async function sendCertificateEmail({ user, results, lang }) {
  if (!user?.email) {
    return { ok: false, reason: 'no_email' };
  }

  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim();
  const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim();
  const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim();

  if (!serviceId || !templateId || !publicKey) {
    return { ok: false, reason: 'not_configured' };
  }

  const validationUrl = generateValidationUrl(results, user);
  const bodyText = buildEmailBody({ user, results, lang });

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
    title: 'Certificado de Proficiência — QuickDoc',
    message: bodyText,
    body: bodyText,
    content: bodyText,
    nationality: user.nationality || '—',
    locale: user.locale || lang,
    net_wpm: String(results.netWpm),
    gross_wpm: String(results.grossWpm),
    accuracy: `${results.accuracy}%`,
    consistency: `${results.consistency}%`,
    rank: getRankLabel(results, lang),
    timestamp: results.timestamp || '—',
    completude: `${results.completude}%`,
    validation_url: validationUrl,
    link: validationUrl,
    performance_score: String(results.performanceScore ?? '—'),
    test_duration: `${results.testDuration}s`,
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
