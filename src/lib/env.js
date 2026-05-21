/** Normaliza Publisher ID do AdSense (aceita pub-XXXX ou ca-pub-XXXX) */
export function getAdSenseClientId() {
  const raw = (import.meta.env.VITE_ADSENSE_CLIENT || '').trim();
  if (!raw) return '';
  if (raw.startsWith('ca-pub-')) return raw;
  if (raw.startsWith('pub-')) return `ca-${raw}`;
  return `ca-pub-${raw}`;
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
