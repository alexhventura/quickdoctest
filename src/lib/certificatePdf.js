import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '@/i18n';
import i18n from '@/i18n';
import qtLogoUrl from '@/assets/QT_V2.png';
import { CertificateDocumentInner, A4_LANDSCAPE } from '@/components/certificate/CertificateDocument';
import { buildCertificateTemplateModel } from '@/components/certificate/certificateTemplate';
import { PAGE_MM } from '@/constants/certificateLayout';

function waitFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isIOSSafari() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

async function waitImages(node) {
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }),
  );
}

function translateForLang(lang) {
  return (key, opts = {}) => i18n.t(key, { lng: lang, ...opts });
}

let exportLogoDataUrlPromise = null;

/** Logo em data URL evita falhas de CORS/taint no html2canvas */
async function getExportLogoDataUrl() {
  if (exportLogoDataUrlPromise) return exportLogoDataUrlPromise;
  exportLogoDataUrlPromise = fetch(qtLogoUrl)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load certificate logo');
      return response.blob();
    })
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result || qtLogoUrl));
          reader.onerror = () => reject(reader.error || new Error('Failed to read logo'));
          reader.readAsDataURL(blob);
        }),
    )
    .catch(() => qtLogoUrl);
  return exportLogoDataUrlPromise;
}

function getPageCaptureTarget(pageEl) {
  return pageEl.firstElementChild || pageEl;
}

function applyCaptureHostStyles(host) {
  const top = typeof window !== 'undefined' ? window.innerHeight + 8 : 0;
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:' + top + 'px',
    'width:' + A4_LANDSCAPE.width + 'px',
    'opacity:1',
    'pointer-events:none',
    'z-index:2147483647',
    'overflow:visible',
  ].join(';');
}

async function mountExportCertificate({ user, results, copy, lang }) {
  const safeLang = lang || i18n.language || 'pt';
  await i18n.changeLanguage(safeLang);

  document.getElementById('qd-pdf-capture-host')?.remove();
  const host = document.createElement('div');
  host.id = 'qd-pdf-capture-host';
  host.setAttribute('aria-hidden', 'true');
  applyCaptureHostStyles(host);
  document.body.appendChild(host);

  const t = translateForLang(safeLang);
  const model = buildCertificateTemplateModel({ results, user, copy, t });
  const logoSrc = await getExportLogoDataUrl();

  const root = createRoot(host);
  root.render(
    createElement(CertificateDocumentInner, {
      model,
      previewStacked: false,
      logoSrc,
    }),
  );

  await waitFrame();
  await waitFrame();
  await waitMs(250);
  await document.fonts?.ready;

  const container = host.querySelector('#certificado-container');
  if (!container) {
    root.unmount();
    host.remove();
    throw new Error('Certificate node not mounted');
  }

  await waitImages(container);

  const pages = Array.from(container.querySelectorAll('.certificate-page'));
  if (pages.length === 0) {
    root.unmount();
    host.remove();
    throw new Error('Certificate pages not found');
  }

  return { host, root, pages };
}

async function rasterizePageElement(pageEl) {
  const target = getPageCaptureTarget(pageEl);
  const canvas = await html2canvas(target, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: false,
    allowTaint: false,
    logging: false,
    width: A4_LANDSCAPE.width,
    height: A4_LANDSCAPE.height,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 20000,
  });

  let dataUrl = '';
  try {
    dataUrl = canvas.toDataURL('image/png');
  } catch {
    dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  }

  if (!dataUrl || dataUrl.length < 200) {
    throw new Error('Certificate page capture produced empty image');
  }

  return {
    dataUrl,
    format: dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG',
  };
}

async function buildPdfFromPages(pages) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  for (let index = 0; index < pages.length; index += 1) {
    const { dataUrl, format } = await rasterizePageElement(pages[index]);
    if (index > 0) pdf.addPage('a4', 'landscape');
    pdf.addImage(dataUrl, format, 0, 0, PAGE_MM.w, PAGE_MM.h);
  }

  return pdf;
}

export const CERTIFICATE_DOWNLOAD_FILENAME = 'quickdoctest-certificado.pdf';

export function getCertificateFileName() {
  return CERTIFICATE_DOWNLOAD_FILENAME;
}

/**
 * Download robusto via Blob + URL.createObjectURL + <a download>.
 * iOS Safari: fallback com window.open se o popup não for bloqueado.
 */
function savePdfBlobToDevice(blob, filename) {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  if (isIOSSafari()) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function buildCertificatePdf({ user, results, copy, lang }) {
  const { host, root, pages } = await mountExportCertificate({ user, results, copy, lang });
  try {
    return await buildPdfFromPages(pages);
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function downloadCertificatePdfFile({ user, results, copy, lang }) {
  const filename = getCertificateFileName();
  const { host, root, pages } = await mountExportCertificate({ user, results, copy, lang });

  try {
    const pdf = await buildPdfFromPages(pages);
    const blob = pdf.output('blob');

    if (!blob || blob.size < 100) {
      throw new Error('Generated PDF is empty');
    }

    savePdfBlobToDevice(blob, filename);

    return { ok: true };
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function getCertificatePdfBlob({ user, results, copy, lang }) {
  return (await buildCertificatePdf({ user, results, copy, lang })).output('blob');
}

export async function getCertificatePdfBase64({ user, results, copy, lang }) {
  const blob = await getCertificatePdfBlob({ user, results, copy, lang });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') {
        reject(new Error('Failed to read PDF blob'));
        return;
      }
      resolve(dataUrl.split(',')[1] || '');
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read PDF blob'));
    reader.readAsDataURL(blob);
  });
}
