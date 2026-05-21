# QuickDocTest — Production Deployment Guide

Everything below marked **(manual)** requires your action. All other items are already implemented in this repository.

Production site: **https://www.quickdoctest.com**

---

## 1. GitHub **(manual)**

1. Create a new repository on GitHub (e.g. `quickdoc-test`).
2. In your project folder, connect and push:

```bash
git init
git add .
git commit -m "Prepare QuickDocTest for production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/quickdoc-test.git
git push -u origin main
```

3. Protect `main` with branch rules if your team requires reviews before merge.

---

## 2. Vercel **(manual)**

1. Sign in at [vercel.com](https://vercel.com) → **Add New Project**.
2. Import the GitHub repository.
3. Framework preset: **Vite** (auto-detected).
4. Build settings (defaults match `vercel.json`):
   - Build command: `npm run build`
   - Output directory: `dist`
5. **Environment variables** — add in Project → Settings → Environment Variables (Production + Preview):

| Variable | Purpose |
|----------|---------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 (e.g. `G-XXXXXXXXXX`) |
| `VITE_GOOGLE_SITE_VERIFICATION` | Search Console HTML tag `content` value |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth for certificates |
| `VITE_ADSENSE_CLIENT` | AdSense publisher (optional) |
| `VITE_ADSENSE_SLOT` | AdSense ad unit (optional) |
| `VITE_EMAILJS_*` | EmailJS (optional) |

Copy names from `.env.example`. Never commit real secrets to Git.

6. Deploy. Vercel runs `prebuild` (PWA assets + sitemap) then `vite build`.

7. After DNS is live, set **Domains** in Vercel:
   - `www.quickdoctest.com` (primary)
   - `quickdoctest.com` (redirects to www via `vercel.json`)

---

## 3. GoDaddy DNS **(manual)**

In GoDaddy → your domain → **DNS**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | Vercel apex IP (shown in Vercel domain settings) | 600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 600 |

Or use Vercel nameservers if you prefer full DNS at Vercel.

1. Add both hostnames in Vercel → Domains and wait for **Valid Configuration**.
2. Enable **HTTPS** (automatic on Vercel).
3. Confirm `https://www.quickdoctest.com` loads and `/pt`, `/en`, `/es` work.

---

## 4. Google Analytics 4 **(manual)**

1. [analytics.google.com](https://analytics.google.com) → Admin → **Create property** for QuickDocTest.
2. Create a **Web** data stream for `https://www.quickdoctest.com`.
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
4. In Vercel, set `VITE_GA_MEASUREMENT_ID` and redeploy.
5. Use **Realtime** to confirm page views on `/en`, `/pt`, `/es`.

Implementation: `src/lib/analytics.js` + `AnalyticsBootstrap` (no hardcoded IDs).

---

## 5. Google Search Console **(manual)**

1. [search.google.com/search-console](https://search.google.com/search-console) → add property **URL prefix**: `https://www.quickdoctest.com`.
2. Choose **HTML tag** verification.
3. Copy only the `content="..."` value from the meta tag.
4. Set `VITE_GOOGLE_SITE_VERIFICATION` in Vercel and redeploy.
5. Click **Verify** in Search Console.
6. Submit sitemap: `https://www.quickdoctest.com/sitemap.xml`
7. Inspect hreflang URLs: `/pt`, `/en`, `/es` and legal pages under each locale.

---

## 6. Google AdSense **(manual)**

The app shows **placeholders only** (no publisher IDs in code):

- Desktop: 160×600 left/right sidebars
- Results: responsive block
- Footer: responsive block

When approved:

1. Create ad units in AdSense (sidebar 160×600, responsive display).
2. Set `VITE_ADSENSE_CLIENT` and `VITE_ADSENSE_SLOT` in Vercel.
3. Replace placeholders with live slots in `AdSenseSlot` where needed.
4. Update **Content-Security-Policy** in `vercel.json` to allow:
   - `https://pagead2.googlesyndication.com`
   - `https://googleads.g.doubleclick.net`
   - `https://tpc.googlesyndication.com`
5. Redeploy and test CLS (layout shift) in Lighthouse.

---

## Already automated in the repo

| Item | Location |
|------|----------|
| Production Vite build + code splitting | `vite.config.js` |
| SPA routing + security headers + cache | `vercel.json` |
| `robots.txt` / `sitemap.xml` | `public/` + `scripts/generate-sitemap.mjs` |
| SEO, canonical, Open Graph, Twitter | `src/hooks/useSeo.js`, `index.html` |
| Multilingual routes + hreflang | `/pt`, `/en`, `/es` in `src/app/App.jsx` |
| GA4 layer | `src/lib/analytics.js` |
| PWA manifest, icons from QT_V2 | `public/manifest.json`, `scripts/copy-pwa-assets.mjs` |
| Ad placeholders | `src/components/ads/AdPlaceholder.jsx` |

---

## Tela branca / CSP (troubleshooting)

Se o site abrir em branco após um deploy:

1. **Hard refresh** no navegador: `Ctrl+Shift+R` (Windows) ou limpar cache do site.
2. Confirme que `vercel.json` é JSON válido e foi deployado (CSP e cache separados para `/assets/*` vs HTML).
3. O projeto **não registra Service Worker**; `main.jsx` remove SW/cache legados na primeira visita.
4. `index.html` e rotas SPA (`/en`, `/pt`, …) usam `Cache-Control: no-cache` — assets em `/assets/*` mantêm hash e cache longo.

---

## Post-deploy checklist **(manual)**

- [ ] `npm run build` succeeds locally
- [ ] Lighthouse on production: Performance > 90, SEO > 95
- [ ] `https://www.quickdoctest.com/robots.txt` and `/sitemap.xml` reachable
- [ ] hreflang alternates visible in page source for each locale
- [ ] Certificate PDF and Google login work with `VITE_GOOGLE_CLIENT_ID`
- [ ] GA4 realtime shows traffic
- [ ] Search Console verified and sitemap submitted

---

## Local production preview

```bash
cp .env.example .env.local
# fill VITE_* values
npm install
npm run build
npm run preview
```

Open `http://localhost:4173/en`.
