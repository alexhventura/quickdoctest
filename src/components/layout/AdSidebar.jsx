import { memo } from 'react';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

function AdSidebar({ side = 'left' }) {
  return (
    <aside
      className={`hidden lg:flex justify-center qd-ad-sidebar qd-ad-sidebar--${side}`}
      aria-label={`Advertisement sidebar ${side}`}
    >
      <AdPlaceholder variant="160x600" sticky />
    </aside>
  );
}

export default memo(AdSidebar);