/** Publisher ID oficial (mesmo do script em index.html e ads.txt). */
export const ADSENSE_PUBLISHER_ID = 'ca-pub-6234467433781084';

/** Normaliza Publisher ID do AdSense (aceita pub-XXXX ou ca-pub-XXXX). */
export function getAdSenseClientId() {
  const raw = (import.meta.env.VITE_ADSENSE_CLIENT || '').trim();
  const value = raw || (import.meta.env.PROD ? ADSENSE_PUBLISHER_ID : '');
  if (!value) return '';
  if (value.startsWith('ca-pub-')) return value;
  if (value.startsWith('pub-')) return `ca-${value}`;
  return `ca-pub-${value}`;
}

export function isAdSensePublisherConfigured() {
  return Boolean(getAdSenseClientId());
}

export function getAdSenseSlot() {
  return (import.meta.env.VITE_ADSENSE_SLOT || '').trim();
}

export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

export function isGoogleAuthConfigured() {
  return Boolean(getGoogleClientId());
}

export function isEmailJsConfigured() {
  return Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
}

export function isAdSenseConfigured() {
  return Boolean(getAdSenseClientId() && getAdSenseSlot());
}

export function getGaMeasurementId() {
  return (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
}

export function getGoogleSiteVerification() {
  return (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim();
}

export function isGaConfigured() {
  return Boolean(getGaMeasurementId());
}
