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
import { CERTIFICATE_SIZE } from '@/components/certificate/certificateTemplate';
import { createPdfExportFrame, destroyPdfExportFrame } from '@/lib/pdfExportFrame';
import { sanitizeCloneForPdfExport } from '@/lib/pdfColorSanitizer';

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

/**
 * Monta certificado em iframe isolado com fonte Arial (html2canvas-safe).
 */
async function mountExportCertificate({ user, results, copy, lang }) {
  const safeLang = lang || i18n.language || 'pt';
  await i18n.changeLanguage(safeLang);

  destroyPdfExportFrame();
  const { mount } = await createPdfExportFrame();

  const t = translateForLang(safeLang);
  const model = buildCertificateTemplateModel({ results, user, copy, t });
  const logoSrc = await getExportLogoDataUrl();

  const root = createRoot(mount);
  root.render(
    createElement(CertificateDocumentInner, {
      model,
      previewStacked: false,
      logoSrc,
      forPdfExport: true,
    }),
  );

  await waitFrame();
  await waitFrame();
  const layoutWait = /Mobi|Android|iPhone|iPad/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : '',
  )
    ? 900
    : 500;
  await waitMs(layoutWait);

  const container = mount.querySelector('#certificado-container');
  if (!container) {
    root.unmount();
    destroyPdfExportFrame();
    throw new Error('Certificate node not mounted');
  }

  await waitImages(container);

  const pages = Array.from(container.querySelectorAll('.certificate-page'));
  if (pages.length === 0) {
    root.unmount();
    destroyPdfExportFrame();
    throw new Error('Certificate pages not found');
  }

  return { root, mount, pages };
}

function cleanupExportMount(root) {
  try {
    root.unmount();
  } catch {
    /* ignore */
  }
  destroyPdfExportFrame();
}

function getCaptureScale(win) {
  const dpr = win?.devicePixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
  return Math.min(2, Math.max(1, dpr));
}

async function rasterizePageElement(pageEl) {
  const target = getPageCaptureTarget(pageEl);
  const doc = target.ownerDocument;
  const win = doc?.defaultView;
  const scale = getCaptureScale(win);

  const canvas = await html2canvas(target, {
    window: win,
    backgroundColor: '#ffffff',
    scale,
    width: CERTIFICATE_SIZE.width,
    height: CERTIFICATE_SIZE.height,
    useCORS: true,
    allowTaint: false,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 20000,
    foreignObjectRendering: false,
    onclone: (clonedDoc) => {
      sanitizeCloneForPdfExport(clonedDoc);
    },
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

function assertValidPdfBlob(blob) {
  if (!blob || blob.size === 0) {
    console.error('[QuickDoc] Certificate PDF blob is empty (size=0)');
    throw new Error('Generated PDF is empty');
  }
  if (blob.size < 100) {
    console.error('[QuickDoc] Certificate PDF blob too small:', blob.size);
    throw new Error('Generated PDF is invalid');
  }
}

export async function buildCertificatePdf({ user, results, copy, lang }) {
  const { root, pages } = await mountExportCertificate({ user, results, copy, lang });
  try {
    return await buildPdfFromPages(pages);
  } finally {
    cleanupExportMount(root);
  }
}

export async function downloadCertificatePdfFile({ user, results, copy, lang }) {
  const filename = getCertificateFileName();
  const { root, pages } = await mountExportCertificate({ user, results, copy, lang });

  try {
    const pdf = await buildPdfFromPages(pages);
    const blob = pdf.output('blob');
    assertValidPdfBlob(blob);

    savePdfBlobToDevice(blob, filename);

    return { ok: true };
  } finally {
    cleanupExportMount(root);
  }
}

export async function getCertificatePdfBlob({ user, results, copy, lang }) {
  const pdf = await buildCertificatePdf({ user, results, copy, lang });
  const blob = pdf.output('blob');
  assertValidPdfBlob(blob);
  return blob;
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
