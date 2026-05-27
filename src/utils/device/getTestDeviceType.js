/** Tipo de dispositivo no momento do teste (largura da viewport). */
export function getTestDeviceType(width = typeof window !== 'undefined' ? window.innerWidth : 1024) {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export function getTestDeviceTypeLabel(type, t) {
  const key = `deviceType_${type || 'unknown'}`;
  const label = t(key);
  return label === key ? t('deviceType_unknown') : label;
}
