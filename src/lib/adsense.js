import { getAdSenseClientId } from '@/lib/env';

const ADSENSE_ORIGIN = 'https://pagead2.googlesyndication.com';
const ADSENSE_SCRIPT_ID = 'qd-adsense-script';

let adSenseLoadPromise = null;

export function isAdSenseEnabled() {
  return Boolean(import.meta.env.PROD && getAdSenseClientId());
}

export function ensureAdSenseScript() {
  if (!isAdSenseEnabled()) return Promise.resolve(false);

  const client = getAdSenseClientId();
  const src = `${ADSENSE_ORIGIN}/pagead/js/adsbygoogle.js?client=${client}`;

  const existing = document.getElementById(ADSENSE_SCRIPT_ID);
  if (existing) return Promise.resolve(true);
  if (adSenseLoadPromise) return adSenseLoadPromise;

  adSenseLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return adSenseLoadPromise;
}
