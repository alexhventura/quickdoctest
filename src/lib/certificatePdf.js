import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '@/i18n';
import i18n from '@/i18n';
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

/** Elemento A4 interno (841×595) dentro de `.certificate-page` */
function getPageCaptureTarget(pageEl) {
  const frame = pageEl.firstElementChild;
  if (frame) return frame;
  return pageEl;
}

async function capturePageElement(pageEl) {
  const target = getPageCaptureTarget(pageEl);
  const canvas = await html2canvas(target, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: A4_LANDSCAPE.width,
    height: A4_LANDSCAPE.height,
    windowWidth: A4_LANDSCAPE.width,
    windowHeight: A4_LANDSCAPE.height,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 15000,
  });

  const dataUrl = canvas.toDataURL('image/png', 1);
  if (!dataUrl || dataUrl.length < 200) {
    throw new Error('Certificate page capture produced empty image');
  }
  return dataUrl;
}

async function capturePagesFromContainer(container) {
  const pages = Array.from(container.querySelectorAll('.certificate-page'));
  if (pages.length === 0) throw new Error('Certificate pages not found');

  const dataUrls = [];
  for (const pageEl of pages) {
    dataUrls.push(await capturePageElement(pageEl));
  }
  return dataUrls;
}

/**
 * Monta o mesmo CertificateDocument da prévia off-screen (visível ao renderer, fora da viewport)
 * e captura cada página para o PDF.
 */
async function renderCertificatePagesToDataUrls({ user, results, copy, lang }) {
  if (typeof window === 'undefined') {
    throw new Error('Certificate export requires browser environment');
  }

  const safeLang = lang || i18n.language || 'pt';
  await i18n.changeLanguage(safeLang);

  document.getElementById('qd-pdf-capture-host')?.remove();
  const host = document.createElement('div');
  host.id = 'qd-pdf-capture-host';
  host.setAttribute('aria-hidden', 'true');
  // Deve ficar na viewport (opacity ~0) — html2canvas falha com left:-10000px
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'width:' + A4_LANDSCAPE.width + 'px',
    'height:auto',
    'opacity:0.01',
    'pointer-events:none',
    'z-index:-1',
    'overflow:hidden',
  ].join(';');
  document.body.appendChild(host);

  const t = translateForLang(safeLang);
  const model = buildCertificateTemplateModel({ results, user, copy, t });

  const root = createRoot(host);
  try {
    root.render(
      createElement(CertificateDocumentInner, {
        model,
        previewStacked: false,
      }),
    );

    await waitFrame();
    await waitFrame();
    await waitMs(120);
    await document.fonts?.ready;

    const container = host.querySelector('#certificado-container');
    if (!container) throw new Error('Certificate node not mounted');

    await waitImages(container);

    return await capturePagesFromContainer(container);
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function buildCertificatePdf({ user, results, copy, lang }) {
  const pageImages = await renderCertificatePagesToDataUrls({ user, results, copy, lang });
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  pageImages.forEach((imageData, index) => {
    if (index > 0) pdf.addPage('a4', 'landscape');
    pdf.addImage(imageData, 'PNG', 0, 0, PAGE_MM.w, PAGE_MM.h);
  });

  return pdf;
}

export function getCertificateFileName(user, results) {
  const slug = user?.name?.replace(/\s+/g, '_') || 'Participante';
  return `Certificado_QUICKDOC_${slug}_${results?.testDuration || 30}s.pdf`;
}

function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);

  const cleanup = () => {
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  };

  if (typeof navigator !== 'undefined' && typeof navigator.msSaveOrOpenBlob === 'function') {
    navigator.msSaveOrOpenBlob(blob, filename);
    cleanup();
    return { method: 'msSaveOrOpenBlob' };
  }

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  cleanup();
  return { method: 'anchor' };
}

export async function downloadCertificatePdfFile({ user, results, copy, lang }) {
  const pdf = await buildCertificatePdf({ user, results, copy, lang });
  const filename = getCertificateFileName(user, results);
  const blob = pdf.output('blob');

  if (!blob || blob.size < 100) {
    throw new Error('Generated PDF is empty');
  }

  const ios = isIOSSafari();

  if (ios) {
    const blobUrl = URL.createObjectURL(blob);
    const opened = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      triggerBlobDownload(blob, filename);
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  } else {
    triggerBlobDownload(blob, filename);
  }

  return { ok: true };
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
