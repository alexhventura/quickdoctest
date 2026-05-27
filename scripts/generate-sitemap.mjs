import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.quickdoctest.com';
const LOCALES = ['pt', 'en', 'es'];
const ROUTES = [
  '',
  '/terms',
  '/privacy',
  '/instructions',
  '/compress-pdf',
  '/merge-pdf',
  '/extract-pdf-text',
];
const now = new Date().toISOString();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

const urls = LOCALES.flatMap((lang) =>
  ROUTES.map((route) => {
    const loc = `${SITE_URL}/${lang}${route}`;
    const priority =
      route === ''
        ? '1.0'
        : route === '/instructions' || route === '/compress-pdf' || route === '/merge-pdf' || route === '/extract-pdf-text'
          ? '0.7'
          : '0.5';
    const changefreq = route === '' ? 'weekly' : 'monthly';
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(outPath, xml, 'utf8');
console.log(`[generate-sitemap] Wrote ${outPath} (${urls.length} URLs)`);
