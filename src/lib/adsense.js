import { getAdSenseClientId } from '@/lib/env';

const ADSENSE_ORIGIN = 'https://pagead2.googlesyndication.com';
const ADSENSE_SCRIPT_ID = 'qd-adsense-script';
const ADSENSE_SCRIPT_MATCH = `${ADSENSE_ORIGIN}/pagead/js/adsbygoogle.js`;

let adSenseLoadPromise = null;

export function isAdSenseEnabled() {
  return Boolean(import.meta.env.PROD && getAdSenseClientId());
}

export function ensureAdSenseScript() {
  if (!isAdSenseEnabled()) return Promise.resolve(false);

  const client = getAdSenseClientId();
  const src = `${ADSENSE_ORIGIN}/pagead/js/adsbygoogle.js?client=${client}`;

  const existing =
    document.getElementById(ADSENSE_SCRIPT_ID) ||
    document.querySelector(`script[src*="${ADSENSE_SCRIPT_MATCH}"]`);
  if (existing) {
    if (window.adsbygoogle) return Promise.resolve(true);
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      setTimeout(() => resolve(Boolean(window.adsbygoogle)), 2000);
    });
  }
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
