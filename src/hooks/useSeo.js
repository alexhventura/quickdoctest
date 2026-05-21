import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HREFLANG_MAP,
  LOCALE_PATHS,
  OG_IMAGE,
  SEO_BY_LANG,
  SITE_NAME,
  SITE_URL,
} from '@/constants/seo';
import { getGoogleSiteVerification } from '@/lib/env';
import { trackPageView } from '@/lib/analytics';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, extras = {}) {
  if (!href) return;
  const selector = Object.entries(extras).reduce(
    (acc, [k, v]) => `${acc}[${k}="${v}"]`,
    `link[rel="${rel}"]`,
  );
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extras).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function stripLocalePrefix(pathname) {
  const match = pathname.match(/^\/(pt|en|es)(\/|$)/);
  if (!match) return pathname === '/' ? '' : pathname;
  const rest = pathname.slice(match[1].length + 1);
  return rest || '';
}

export function useSeo({ title, description, lang = 'en' } = {}) {
  const { pathname } = useLocation();
  const localeMeta = SEO_BY_LANG[lang] || SEO_BY_LANG.en;
  const pageTitle = title || localeMeta.title || DEFAULT_TITLE;
  const pageDescription = description || localeMeta.description || DEFAULT_DESCRIPTION;
  const suffixPath = stripLocalePrefix(pathname);
  const canonicalUrl = `${SITE_URL}/${lang}${suffixPath}`;

  useEffect(() => {
    document.title = pageTitle;
    document.documentElement.lang = HREFLANG_MAP[lang] || 'en';

    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'google-site-verification', getGoogleSiteVerification());

    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', OG_IMAGE);
    upsertMeta('property', 'og:locale', HREFLANG_MAP[lang] || 'en');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', OG_IMAGE);

    document.querySelectorAll('link[data-qd-hreflang]').forEach((n) => n.remove());

    LOCALE_PATHS.forEach((code) => {
      const href = `${SITE_URL}/${code}${suffixPath}`;
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = HREFLANG_MAP[code];
      link.href = href;
      link.dataset.qdHreflang = '1';
      document.head.appendChild(link);
    });

    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${SITE_URL}/en${suffixPath}`;
    xDefault.dataset.qdHreflang = '1';
    document.head.appendChild(xDefault);

    trackPageView(`/${lang}${suffixPath}`, pageTitle);
  }, [pageTitle, pageDescription, canonicalUrl, lang, suffixPath]);
}
