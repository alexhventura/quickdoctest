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
  // Fundo azul premium em gradiente
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#020617'); // slate-950
  gradient.addColorStop(0.45, '#0b1f3b');
  gradient.addColorStop(1, '#111827'); // slate-900
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Auréola circular direita (glassmorphism leve)
  const radial = ctx.createRadialGradient(
    width * 0.85,
    height * 0.5,
    width * 0.05,
    width * 0.85,
    height * 0.5,
    width * 0.4,
  );
  radial.addColorStop(0, 'rgba(56,189,248,0.22)');
  radial.addColorStop(1, 'rgba(15,23,42,0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.5, width * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Bordas internas em tons claros para manter moldura premium
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, width - 104, height - 104);
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
        <defs>
          <linearGradient
            id="qd-cert-bg"
            x1="0"
            y1="0"
            x2={A4_LANDSCAPE.width}
            y2={A4_LANDSCAPE.height}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#020617" />
            <stop offset="0.45" stopColor="#0b1f3b" />
            <stop offset="1" stopColor="#111827" />
          </linearGradient>
          <radialGradient
            id="qd-cert-orbit"
            cx="85%"
            cy="50%"
            r="45%"
          >
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="1" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width={A4_LANDSCAPE.width}
          height={A4_LANDSCAPE.height}
          fill="url(#qd-cert-bg)"
        />

        <circle
          cx={A4_LANDSCAPE.width * 0.85}
          cy={A4_LANDSCAPE.height * 0.5}
          r={A4_LANDSCAPE.width * 0.45}
          fill="url(#qd-cert-orbit)"
        />

        <rect
          x="10"
          y="10"
          width={A4_LANDSCAPE.width - 20}
          height={A4_LANDSCAPE.height - 20}
          fill="none"
          stroke="rgba(148,163,184,0.9)"
          strokeWidth="14"
        />
        <rect
          x="40"
          y="40"
          width={A4_LANDSCAPE.width - 80}
          height={A4_LANDSCAPE.height - 80}
          fill="none"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1.4"
        />
        <rect
          x="52"
          y="52"
          width={A4_LANDSCAPE.width - 104}
          height={A4_LANDSCAPE.height - 104}
          fill="none"
          stroke="rgba(148,163,184,0.22)"
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
