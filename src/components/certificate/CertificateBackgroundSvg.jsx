import { memo } from 'react';
import { A4_LANDSCAPE } from '@/constants/certificateLayout';
import qtLogo from '@/assets/QT_V2.png';
import qtLogoUrl from '@/assets/QT_V2.png?url';

/** Tamanhos proporcionais do logo oficial QuickDocTest */
export function getCertificateLogoSizes(width = A4_LANDSCAPE.width) {
  return {
    logoSize: Math.max(72, Math.min(100, width * 0.105)),
    watermarkSize: Math.max(260, Math.min(360, width * 0.38)),
    logoTop: 58,
    logoLeft: 78,
  };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCertificateFrame(ctx, width, height) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#123D6D';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, width - 16, height - 16);

  ctx.strokeStyle = '#A8B4C7';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = '#D7DEE8';
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, width - 92, height - 92);
  ctx.setLineDash([]);
}

function drawOfficialLogos(ctx, logoImg, width, height) {
  const { logoSize, watermarkSize, logoTop, logoLeft } = getCertificateLogoSizes(width);
  const aspect = logoImg.naturalHeight / logoImg.naturalWidth;

  const logoH = logoSize * aspect;
  ctx.globalAlpha = 1;
  ctx.drawImage(logoImg, logoLeft, logoTop, logoSize, logoH);

  const wmW = watermarkSize;
  const wmH = wmW * aspect;
  ctx.globalAlpha = 0.045;
  ctx.drawImage(logoImg, (width - wmW) / 2, (height - wmH) / 2, wmW, wmH);
  ctx.globalAlpha = 1;
}

/** Rasteriza fundo A4 com moldura vetorial + logo oficial PNG (PDF / export) */
export async function renderCertificateBackgroundToDataUrl(
  width = A4_LANDSCAPE.width,
  height = A4_LANDSCAPE.height,
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  drawCertificateFrame(ctx, width, height);
  const logoImg = await loadImage(qtLogoUrl);
  drawOfficialLogos(ctx, logoImg, width, height);

  return canvas.toDataURL('image/png', 1);
}

function CertificateBackgroundSvg() {
  const { logoSize, watermarkSize, logoTop, logoLeft } = getCertificateLogoSizes();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#ffffff',
      }}
      aria-hidden
    >
      <svg
        width={A4_LANDSCAPE.width}
        height={A4_LANDSCAPE.height}
        viewBox={`0 0 ${A4_LANDSCAPE.width} ${A4_LANDSCAPE.height}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        aria-hidden
      >
        <rect
          x="8"
          y="8"
          width={A4_LANDSCAPE.width - 16}
          height={A4_LANDSCAPE.height - 16}
          fill="none"
          stroke="#123D6D"
          strokeWidth="16"
        />
        <rect
          x="36"
          y="36"
          width={A4_LANDSCAPE.width - 72}
          height={A4_LANDSCAPE.height - 72}
          fill="none"
          stroke="#A8B4C7"
          strokeWidth="1.4"
        />
        <rect
          x="46"
          y="46"
          width={A4_LANDSCAPE.width - 92}
          height={A4_LANDSCAPE.height - 92}
          fill="none"
          stroke="#D7DEE8"
          strokeWidth="1"
          strokeDasharray="7 6"
        />
      </svg>

      <img
        src={qtLogo}
        alt="QuickDocTest"
        style={{
          position: 'absolute',
          top: logoTop,
          left: logoLeft,
          width: logoSize,
          height: 'auto',
          objectFit: 'contain',
        }}
      />

      <img
        src={qtLogo}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: watermarkSize,
          maxWidth: '38%',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          opacity: 0.045,
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default memo(CertificateBackgroundSvg);
