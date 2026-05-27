import AdsenseBlock from '@/components/ads/AdsenseBlock';

/**
 * Compat layer: mantenha imports existentes usando AdSenseSlot
 * enquanto o componente novo AdsenseBlock concentra a lógica segura.
 */
export default function AdSenseSlot({
  slot,
  format = 'auto',
  minHeight = 250,
  className = '',
}) {
  return (
    <AdsenseBlock
      adSlot={slot}
      adFormat={format}
      responsive
      minHeight={minHeight}
      className={className}
    />
  );
}
