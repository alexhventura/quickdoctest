import { CERTIFICATE_SIZE } from '@/components/certificate/certificateTemplate';
import { PDF_EXPORT_BASE_CSS } from '@/components/certificate/certificatePdfStyles';

const FRAME_ID = 'qd-pdf-capture-iframe';
const FRAME_PAD = 24;

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Iframe isolado para PDF — apenas CSS local + Arial (sem Google Fonts / Tailwind).
 */
export async function createPdfExportFrame() {
  document.getElementById(FRAME_ID)?.remove();

  const iframe = document.createElement('iframe');
  iframe.id = FRAME_ID;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'PDF export');
  const frameW = CERTIFICATE_SIZE.width + FRAME_PAD;
  const frameH = CERTIFICATE_SIZE.height + FRAME_PAD;

  iframe.style.cssText = [
    'position:fixed',
    'left:0',
    `top:${typeof window !== 'undefined' ? window.innerHeight + 8 : 0}px`,
    `width:${frameW}px`,
    `height:${frameH}px`,
    'border:0',
    'opacity:1',
    'visibility:visible',
    'pointer-events:none',
    'z-index:2147483647',
  ].join(';');

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error('PDF export iframe document unavailable');
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <style data-qdf-keep="true">${PDF_EXPORT_BASE_CSS}</style>
</head>
<body></body>
</html>`);
  doc.close();

  await waitMs(80);

  const mount = doc.createElement('div');
  mount.id = 'qd-pdf-capture-host';
  mount.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(mount);

  return { iframe, doc, mount };
}

export function destroyPdfExportFrame() {
  document.getElementById(FRAME_ID)?.remove();
}
