import { getGaMeasurementId, isGaConfigured } from '@/lib/env';

let initialized = false;

export function initAnalytics() {
  const measurementId = getGaMeasurementId();
  if (!isGaConfigured() || initialized || typeof window === 'undefined') {
    return;
  }

  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function trackPageView(path, title) {
  if (!isGaConfigured() || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: `${window.location.origin}${path}`,
  });
}
