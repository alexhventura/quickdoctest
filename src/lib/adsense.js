import { getAdSenseClientId, isAdSensePublisherConfigured } from '@/lib/env';

const ADSENSE_ORIGIN = 'https://pagead2.googlesyndication.com';
const ADSENSE_SCRIPT_MATCH = `${ADSENSE_ORIGIN}/pagead/js/adsbygoogle.js`;

let adSenseReadyPromise = null;

/** Produção com publisher configurado (env ou ID padrão do site). */
export function isAdSenseEnabled() {
  return Boolean(import.meta.env.PROD && isAdSensePublisherConfigured());
}

/**
 * Aguarda o script oficial do <head> (index.html). Não injeta segunda cópia.
 */
export function ensureAdSenseScript() {
  if (!isAdSenseEnabled()) return Promise.resolve(false);

  const existing = document.querySelector(`script[src*="${ADSENSE_SCRIPT_MATCH}"]`);
  if (!existing) {
    console.warn('[QuickDoc] AdSense script not found in document head');
    return Promise.resolve(false);
  }

  if (window.adsbygoogle) return Promise.resolve(true);
  if (adSenseReadyPromise) return adSenseReadyPromise;

  adSenseReadyPromise = new Promise((resolve) => {
    const finish = () => resolve(Boolean(window.adsbygoogle));

    existing.addEventListener('load', finish, { once: true });
    existing.addEventListener('error', () => resolve(false), { once: true });
    setTimeout(finish, 3500);
  });

  return adSenseReadyPromise;
}
