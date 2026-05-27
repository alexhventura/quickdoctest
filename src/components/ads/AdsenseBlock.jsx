import { memo, useEffect, useRef } from 'react';
import { getAdSenseClientId, getAdSenseSlot } from '@/lib/env';
import { ensureAdSenseScript, isAdSenseEnabled } from '@/lib/adsense';

const DEFAULT_MIN_HEIGHT = 120;

function AdsenseBlock({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  minHeight = DEFAULT_MIN_HEIGHT,
}) {
  const wrapperRef = useRef(null);
  const insRef = useRef(null);
  const pushedRef = useRef(false);
  const resolvedSlot = adSlot || getAdSenseSlot();
  const adClient = getAdSenseClientId();

  useEffect(() => {
    if (!isAdSenseEnabled() || !resolvedSlot || !adClient) return;
    if (!wrapperRef.current || !insRef.current || pushedRef.current) return;

    let cancelled = false;
    let observer;

    const pushAd = async () => {
      const loaded = await ensureAdSenseScript();
      if (!loaded || cancelled || pushedRef.current || !insRef.current) return;

      const status = insRef.current.getAttribute('data-adsbygoogle-status');
      if (status === 'done') {
        pushedRef.current = true;
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (_error) {
        // Silencia erro intermitente de corrida do AdSense; próxima montagem tenta novamente.
      }
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry?.isIntersecting) {
            observer.disconnect();
            pushAd();
          }
        },
        { rootMargin: '200px 0px' },
      );
      observer.observe(wrapperRef.current);
    } else {
      pushAd();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [adClient, adFormat, resolvedSlot]);

  if (!resolvedSlot || !adClient) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ minHeight, width: '100%', overflow: 'hidden' }}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={adClient}
        data-ad-slot={resolvedSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

export default memo(AdsenseBlock);
