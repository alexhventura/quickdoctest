import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_KEYWORDS,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HREFLANG_MAP,
  LOCALE_PATHS,
  OG_IMAGE,
  SEO_BY_LANG,
  SITE_AUTHOR,
  SITE_CATEGORY,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
  TWITTER_CARD,
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

export function useSeo({
  title,
  description,
  lang = 'en',
  faqItems = [],
  canonicalPath,
} = {}) {
  const { pathname } = useLocation();
  const localeMeta = SEO_BY_LANG[lang] || SEO_BY_LANG.en;
  const pageTitle = title || localeMeta.title || DEFAULT_TITLE;
  const pageDescription = description || localeMeta.description || DEFAULT_DESCRIPTION;
  const suffixPath = stripLocalePrefix(pathname);
  const canonicalUrl = canonicalPath
    ? `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : `${SITE_URL}/${lang}${suffixPath}`;

  function upsertJsonLd(id, schema) {
    let script = document.querySelector(`script[data-qd-jsonld="${id}"]`);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.qdJsonld = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  useEffect(() => {
    document.title = pageTitle;
    document.documentElement.lang = HREFLANG_MAP[lang] || 'en';

    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'keywords', DEFAULT_KEYWORDS);
    upsertMeta('name', 'author', SITE_AUTHOR);
    upsertMeta('name', 'creator', SITE_NAME);
    upsertMeta('name', 'publisher', SITE_NAME);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertMeta('name', 'google-site-verification', getGoogleSiteVerification());

    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', OG_IMAGE);
    upsertMeta('property', 'og:locale', HREFLANG_MAP[lang] || 'en');

    upsertMeta('name', 'twitter:card', TWITTER_CARD);
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', OG_IMAGE);
    upsertMeta('name', 'twitter:url', canonicalUrl);

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

    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO,
    });

    upsertJsonLd('software-application', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      description: pageDescription,
      applicationCategory: SITE_CATEGORY,
      operatingSystem: 'Web',
      url: canonicalUrl,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });

    upsertJsonLd('web-application', {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: canonicalUrl,
      description: pageDescription,
      applicationCategory: SITE_CATEGORY,
      operatingSystem: 'Web, Android, iOS',
      browserRequirements: 'Requires JavaScript and modern browser',
      inLanguage: HREFLANG_MAP[lang] || 'en',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });

    if (Array.isArray(faqItems) && faqItems.length > 0) {
      upsertJsonLd('faq-page', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    } else {
      document.querySelector('script[data-qd-jsonld="faq-page"]')?.remove();
    }

    const analyticsPath = canonicalPath || `/${lang}${suffixPath}`;
    trackPageView(analyticsPath, pageTitle);
  }, [pageTitle, pageDescription, canonicalUrl, lang, suffixPath, faqItems, canonicalPath]);
}
