import { useEffect, useMemo, useState } from 'react';

function detectDevice() {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
    };
  }

  const ua = navigator.userAgent || '';
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const maxTouch = navigator.maxTouchPoints || 0;
  const width = window.innerWidth || 1280;

  const uaMobile = /Mobi|Android|iPhone|iPod|Windows Phone|BlackBerry/i.test(ua);
  const uaTablet = /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua);
  const touch = coarse || maxTouch > 0;

  const isTablet = uaTablet || (touch && width >= 768 && width <= 1024);
  const isMobile = !isTablet && (uaMobile || (touch && width < 768));
  const type = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return {
    type,
    isMobile,
    isTablet,
    isDesktop: type === 'desktop',
    hasTouch: touch,
  };
}

export function useDeviceProfile() {
  const [profile, setProfile] = useState(() => detectDevice());

  useEffect(() => {
    const onChange = () => setProfile(detectDevice());
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);

  return useMemo(
    () => ({
      ...profile,
      isMobileLike: profile.isMobile || profile.isTablet,
    }),
    [profile],
  );
}

