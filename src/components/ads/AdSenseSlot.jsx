import { memo, useEffect, useRef } from 'react';
import { getAdSenseClientId, getAdSenseSlot } from '@/lib/env';

const AD_CLIENT = getAdSenseClientId();
const AD_SLOT = getAdSenseSlot();

let adsScriptLoading = false;

function loadAdSenseScript(clientId) {
  if (!clientId || adsScriptLoading || document.querySelector('script[data-adsense]')) {
    return Promise.resolve();
  }
  adsScriptLoading = true;
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.dataset.adsense = '1';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

/** Slot AdSense com altura reservada (evita CLS) */
function AdSenseSlot({ slot, format = 'auto', minHeight = 250, className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);
  const adSlot = slot || AD_SLOT;

  useEffect(() => {
    if (!AD_CLIENT || !adSlot || !ref.current || pushed.current) return;

    loadAdSenseScript(AD_CLIENT).then(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.warn('[QuickDoc] AdSense:', e);
      }
    });
  }, [adSlot]);

  if (!AD_CLIENT || !adSlot) {
    return (
      <div
        className={`qd-ad-placeholder ${className}`}
        style={{ minHeight }}
        role="complementary"
        aria-label="Advertisement"
      >
        <span className="qd-ad-placeholder__label">Ad</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight }} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default memo(AdSenseSlot);
