import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateDocument, { A4_LANDSCAPE } from '@/components/certificate/CertificateDocument';
import { PAGE_MM } from '@/constants/certificateLayout';

function waitFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
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
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }),
  );
}

const CAPTURE_OPTS = {
  backgroundColor: null,
  scale: 2,
  useCORS: true,
  allowTaint: false,
  logging: false,
  width: A4_LANDSCAPE.width,
  height: A4_LANDSCAPE.height,
  windowWidth: A4_LANDSCAPE.width,
  windowHeight: A4_LANDSCAPE.height,
  scrollX: 0,
  scrollY: 0,
};

/**
 * Renderiza off-screen com o mesmo CertificateDocument usado na prévia.
 * Captura cada `.certificate-page` separadamente para paginação correta no PDF.
 */
async function renderCertificatePagesToDataUrls({ user, results, copy }) {
  if (typeof window === 'undefined') {
    throw new Error('Certificate export requires browser environment');
  }

  document.getElementById('qd-pdf-capture-host')?.remove();
  const host = document.createElement('div');
  host.id = 'qd-pdf-capture-host';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'pointer-events:none',
    'opacity:0',
    'z-index:-1',
    'overflow:hidden',
  ].join(';');
  document.body.appendChild(host);

  const root = createRoot(host);
  try {
    root.render(
      createElement(CertificateDocument, { results, user, copy, previewStacked: false }),
    );
    await waitFrame();
    await waitFrame();
    await document.fonts?.ready;

    const container = host.querySelector('#certificado-container');
    if (!container) throw new Error('Certificate node not mounted');

    await waitImages(container);

    const pages = Array.from(container.querySelectorAll('.certificate-page'));
    if (pages.length === 0) throw new Error('Certificate pages not found');

    const dataUrls = [];
    for (const pageEl of pages) {
      const canvas = await html2canvas(pageEl, CAPTURE_OPTS);
      dataUrls.push(canvas.toDataURL('image/png', 1));
    }
    return dataUrls;
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function buildCertificatePdf({ user, results, copy }) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageImages = await renderCertificatePagesToDataUrls({ user, results, copy });

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

export async function downloadCertificatePdfFile({ user, results, copy }) {
  const pdf = await buildCertificatePdf({ user, results, copy });
  const filename = getCertificateFileName(user, results);
  const blob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const ios = isIOSSafari();

  const triggerAnchorDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  try {
    if (ios) {
      const opened = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        triggerAnchorDownload();
      }
    } else {
      triggerAnchorDownload();
    }
  } finally {
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  return { ok: true };
}

export async function getCertificatePdfBlob({ user, results, copy }) {
  return (await buildCertificatePdf({ user, results, copy })).output('blob');
}

export async function getCertificatePdfBase64({ user, results, copy }) {
  const blob = await getCertificatePdfBlob({ user, results, copy });
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
