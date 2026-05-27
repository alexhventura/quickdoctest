import { useEffect, useRef, useState } from 'react';
import { CERTIFICATE_SIZE } from './certificateTemplate';

const PAGE_GAP = 20;

/**
 * Escala o certificado A4 para caber na largura disponível (prévia responsiva).
 */
export default function CertificatePreviewScaler({ children, pageCount = 1 }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  const nativeHeight =
    pageCount * CERTIFICATE_SIZE.height + Math.max(0, pageCount - 1) * PAGE_GAP;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width <= 0) return;
      setScale(Math.min(1, width / CERTIFICATE_SIZE.width));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={ref} className="w-full mx-auto" style={{ height: nativeHeight * scale }}>
      <div
        style={{
          width: CERTIFICATE_SIZE.width,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
