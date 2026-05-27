import { PDF_EXPORT_BASE_CSS } from '@/components/certificate/certificatePdfStyles';

const FRAME_ID = 'qd-pdf-capture-iframe';

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cria iframe isolado sem CSS do app (Tailwind/lab).
 * O certificado é renderizado apenas com estilos inline HEX/RGB.
 */
export async function createPdfExportFrame() {
  document.getElementById(FRAME_ID)?.remove();

  const iframe = document.createElement('iframe');
  iframe.id = FRAME_ID;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'PDF export');
  iframe.style.cssText = [
    'position:fixed',
    'left:0',
    `top:${typeof window !== 'undefined' ? window.innerHeight + 8 : 0}px`,
    'width:900px',
    'height:1400px',
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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
  <style data-qdf-keep="true">${PDF_EXPORT_BASE_CSS}</style>
</head>
<body></body>
</html>`);
  doc.close();

  await waitMs(50);
  if (doc.fonts?.ready) {
    await doc.fonts.ready;
  }

  const mount = doc.createElement('div');
  mount.id = 'qd-pdf-capture-host';
  mount.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(mount);

  return { iframe, doc, mount };
}

export function destroyPdfExportFrame() {
  document.getElementById(FRAME_ID)?.remove();
}
