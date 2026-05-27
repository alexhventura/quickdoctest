/** Chave interna: mobile | tablet | desktop */
export function getTestDeviceType() {
  return getDeviceTypeKey();
}

function getDeviceTypeKey() {
  if (typeof navigator === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();
  const isIpadOs =
    navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1;

  const isTablet = /ipad|tablet|playbook|silk/.test(ua) || isIpadOs;
  const isMobile = /android|iphone|ipod/.test(ua) && !isTablet;

  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

/** Sistema operacional (UA — confiável para certificado). */
export function getOS() {
  if (typeof navigator === 'undefined') return '';

  const ua = navigator.userAgent;

  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('iPhone') || ua.includes('iPad') || isIpadOsUa(ua)) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Mac OS') || ua.includes('Macintosh')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';

  return '';
}

function isIpadOsUa(ua) {
  return (
    typeof navigator !== 'undefined' &&
    navigator.platform === 'MacIntel' &&
    (navigator.maxTouchPoints || 0) > 1 &&
    !/iPhone|iPod/.test(ua)
  );
}

/** Navegador (ordem: Edge → Firefox → Chrome → Safari). */
export function getBrowser() {
  if (typeof navigator === 'undefined') return '';

  const ua = navigator.userAgent;

  if (ua.includes('Edg/') || ua.includes('EdgA') || ua.includes('EdgiOS')) return 'Edge';
  if (ua.includes('Firefox') || ua.includes('FxiOS')) return 'Firefox';
  if (ua.includes('CriOS')) return 'Google Chrome';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Google Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';

  return '';
}

/** Resolução física da tela (ex.: 1080x2400). */
export function getScreenResolution() {
  if (typeof window === 'undefined' || !window.screen) return '';

  const w = window.screen.width;
  const h = window.screen.height;
  if (!w || !h) return '';

  return `${w}x${h}`;
}

/** Partes detectadas no momento do teste (para gravar nos resultados). */
export function buildDeviceInfoParts() {
  return {
    type: getDeviceTypeKey(),
    os: getOS(),
    browser: getBrowser(),
    screen: getScreenResolution(),
  };
}

export function getTestDeviceTypeLabel(type, t) {
  const key = `deviceType_${type || 'unknown'}`;
  const label = t(key);
  return label === key ? t('deviceType_unknown') : label;
}

/**
 * Tipo — SO — Navegador [(largura)x(altura)]
 * Ex.: Celular — Android — Google Chrome (1080x2400)
 */
export function formatDeviceInfo(parts, t, { includeScreen = true } = {}) {
  const typeLabel = getTestDeviceTypeLabel(parts?.type, t);
  const os = parts?.os || t('deviceOs_unknown');
  const browser = parts?.browser || t('deviceBrowser_unknown');
  const core = `${typeLabel} — ${os} — ${browser}`;

  if (includeScreen && parts?.screen) {
    return `${core} (${parts.screen})`;
  }

  return core;
}

/** Função única: informação completa do dispositivo para o certificado. */
export function getDeviceInfo(t, options) {
  return formatDeviceInfo(buildDeviceInfoParts(), t, options);
}

/** Snapshot no início do teste (tipo + partes para reformatar no idioma do certificado). */
export function captureTestDeviceSnapshot() {
  const parts = buildDeviceInfoParts();
  return {
    type: parts.type,
    parts,
  };
}

export function resolveTestDeviceFromProfile() {
  return captureTestDeviceSnapshot();
}

export function buildCertificateDeviceLine(results, t) {
  const parts = results?.deviceInfoParts;
  const info = parts
    ? formatDeviceInfo(parts, t, { includeScreen: true })
    : String(results?.deviceInfo || '').trim() || getDeviceInfo(t);

  return t('certDeviceUsed', { device: info });
}
