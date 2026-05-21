import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/** Inicializa GA4 uma vez quando measurement ID está no ambiente */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
