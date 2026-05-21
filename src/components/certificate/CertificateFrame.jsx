import { memo } from 'react';
import { CERT_COLORS } from '@/constants/certificateLayout';

/** Moldura decorativa A4 — fundo branco, borda navy e cantoneiras (sem fundo escuro) */
function CertificateFrame({ children }) {
  const corner = (pos) => (
    <div
      className={`qd-cert-corner qd-cert-corner--${pos}`}
      style={{
        position: 'absolute',
        width: 28,
        height: 28,
        pointerEvents: 'none',
        ...(pos.includes('top') ? { top: 18 } : { bottom: 18 }),
        ...(pos.includes('left') ? { left: 18 } : { right: 18 }),
      }}
      aria-hidden
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d={pos.includes('left') ? 'M4 4 H20 M4 4 V20' : 'M24 4 H8 M24 4 V20'}
          stroke={CERT_COLORS.slateMuted}
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <text
          x={pos.includes('left') ? 10 : 18}
          y={pos.includes('top') ? 16 : 12}
          fill={CERT_COLORS.slateMuted}
          fontSize="8"
          textAnchor="middle"
        >
          ★
        </text>
      </svg>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 10,
          border: `5px solid ${CERT_COLORS.navy}`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 20,
          border: `1px dashed ${CERT_COLORS.slateMuted}`,
          opacity: 0.65,
          borderRadius: 2,
        }}
      />
      {corner('top-left')}
      {corner('top-right')}
      {corner('bottom-left')}
      {corner('bottom-right')}
      {children}
    </div>
  );
}

export default memo(CertificateFrame);
