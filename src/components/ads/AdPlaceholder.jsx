import { memo } from 'react';

const SIZE_PRESETS = {
  '160x600': { width: 160, height: 600, label: '160 × 600' },
  responsive: { width: '100%', height: null, minHeight: 120, label: 'Responsive' },
  leaderboard: { width: '100%', height: null, minHeight: 90, label: '728 × 90' },
};

/**
 * Placeholder visual para anúncios — sem IDs de publisher.
 * Ative VITE_ADSENSE_CLIENT no ambiente para slots reais via AdSenseSlot.
 */
function AdPlaceholder({
  variant = 'responsive',
  className = '',
  sticky = false,
}) {
  const preset = SIZE_PRESETS[variant] || SIZE_PRESETS.responsive;

  return (
    <div
      className={`qd-ad-slot qd-ad-slot--${variant} ${sticky ? 'qd-ad-slot--sticky' : ''} ${className}`}
      style={{
        width: preset.width,
        height: preset.height ?? undefined,
        minHeight: preset.minHeight,
      }}
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      <span className="qd-ad-slot__label">Ad</span>
      <span className="qd-ad-slot__size">{preset.label}</span>
    </div>
  );
}

export default memo(AdPlaceholder);
