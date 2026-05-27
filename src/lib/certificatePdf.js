import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateDocument, { A4_LANDSCAPE } from '@/components/certificate/CertificateDocument';
import { PAGE_MM } from '@/constants/certificateLayout';

function waitFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
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

async function renderCertificateToDataUrl({ user, results, copy }) {
  if (typeof window === 'undefined') {
    throw new Error('Certificate export requires browser environment');
  }

  document.getElementById('qd-pdf-capture-host')?.remove();
  const host = document.createElement('div');
  host.id = 'qd-pdf-capture-host';
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = `${A4_LANDSCAPE.width}px`;
  host.style.height = `${A4_LANDSCAPE.height}px`;
  host.style.pointerEvents = 'none';
  host.style.opacity = '1';
  host.style.zIndex = '-1';
  document.body.appendChild(host);

  const root = createRoot(host);
  try {
    root.render(createElement(CertificateDocument, { results, user, copy }));
    await waitFrame();
    await waitFrame();
    await document.fonts?.ready;

    const node = host.querySelector('#certificado-container');
    if (!node) throw new Error('Certificate node not mounted');

    await waitImages(node);

    const canvas = await html2canvas(node, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
      width: A4_LANDSCAPE.width,
      height: A4_LANDSCAPE.height,
    });

    return canvas.toDataURL('image/png', 1);
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function buildCertificatePdf({ user, results, copy }) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const imageData = await renderCertificateToDataUrl({ user, results, copy });
  pdf.addImage(imageData, 'PNG', 0, 0, PAGE_MM.w, PAGE_MM.h);
  return pdf;
}

export function getCertificateFileName(user, results) {
  const slug = user?.name?.replace(/\s+/g, '_') || 'Participante';
  return `Certificado_QUICKDOC_${slug}_${results?.testDuration || 30}s.pdf`;
}

export async function downloadCertificatePdfFile({ user, results, copy }) {
  const pdf = await buildCertificatePdf({ user, results, copy });
  pdf.save(getCertificateFileName(user, results));
  return { ok: true };
}

export async function getCertificatePdfBlob({ user, results, copy }) {
  return (await buildCertificatePdf({ user, results, copy })).output('blob');
}
