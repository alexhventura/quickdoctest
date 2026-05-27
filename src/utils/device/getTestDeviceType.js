/** Tipo de dispositivo no momento do teste (UA + touch + largura). */
export function getTestDeviceType(width = typeof window !== 'undefined' ? window.innerWidth : 1024) {
  if (typeof navigator === 'undefined') {
    return width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';
  }

  const ua = navigator.userAgent || '';
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const maxTouch = navigator.maxTouchPoints || 0;
  const touch = coarse || maxTouch > 0;

  const uaMobile = /Mobi|Android|iPhone|iPod|Windows Phone|BlackBerry/i.test(ua);
  const uaTablet = /iPad|Tablet|Nexus 7|Nexus 10|KFAPWI/i.test(ua);
  const isIpadOs =
    navigator.platform === 'MacIntel' && maxTouch > 1 && !/iPhone|iPod/.test(ua);

  if (uaTablet || isIpadOs || (touch && width >= 768 && width < 1024)) {
    return 'tablet';
  }
  if (uaMobile || (touch && width < 768)) {
    return 'mobile';
  }
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

/** Detalhe legível do aparelho (modelo / SO) para o certificado. */
export function getTestDeviceDetail() {
  if (typeof navigator === 'undefined') return '';

  const ua = navigator.userAgent || '';

  const iosVersion = () => {
    const m = ua.match(/OS (\d+[_\d]*)/);
    return m ? m[1].replace(/_/g, '.') : '';
  };

  if (/iPhone|iPod/.test(ua)) {
    const ver = iosVersion();
    return ver ? `iPhone · iOS ${ver}` : 'iPhone · iOS';
  }

  if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    const ver = iosVersion();
    return ver ? `iPad · iOS ${ver}` : 'iPad · iOS';
  }

  if (/Android/i.test(ua)) {
    const ver = ua.match(/Android\s([\d.]+)/i)?.[1];
    const model = ua.match(/Android\s[\d.]+;\s*([^)]+)\)/i)?.[1]?.trim();
    const parts = ['Android'];
    if (ver) parts.push(ver);
    if (model && model !== 'Mobile' && !/^sdk_/i.test(model)) {
      parts.push(model);
    }
    return parts.join(' · ');
  }

  if (/Windows Phone/i.test(ua)) return 'Windows Phone';

  return '';
}

export function resolveTestDeviceFromProfile(deviceProfile) {
  if (!deviceProfile) {
    return {
      type: getTestDeviceType(),
      detail: getTestDeviceDetail(),
    };
  }

  const type = deviceProfile.isMobile
    ? 'mobile'
    : deviceProfile.isTablet
      ? 'tablet'
      : deviceProfile.isDesktop
        ? 'desktop'
        : getTestDeviceType();

  const detail = type === 'desktop' ? '' : getTestDeviceDetail();

  return { type, detail };
}

export function getTestDeviceTypeLabel(type, t) {
  const key = `deviceType_${type || 'unknown'}`;
  const label = t(key);
  return label === key ? t('deviceType_unknown') : label;
}

export function buildCertificateDeviceLine(results, t) {
  const deviceLabel = getTestDeviceTypeLabel(results?.deviceType, t);
  const detail = String(results?.deviceDetail || '').trim();

  if (detail) {
    return t('certDeviceUsedWithDetail', { device: deviceLabel, detail });
  }

  return t('certDeviceUsed', { device: deviceLabel });
}
