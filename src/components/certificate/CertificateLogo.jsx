import { memo } from 'react';
import qtLogo from '@/assets/QT_V2.png';

function CertificateLogo({ size = 90 }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden
    >
      <img
        src={qtLogo}
        alt="QuickDocTest"
        style={{
          width: size,
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}

export default memo(CertificateLogo);