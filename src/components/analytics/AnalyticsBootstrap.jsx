import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';
import { ensureAdSenseScript } from '@/lib/adsense';

/** Inicializa GA4 e aguarda AdSense do <head> (sem injetar script duplicado). */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics();
    void ensureAdSenseScript();
  }, []);

  return null;
}
