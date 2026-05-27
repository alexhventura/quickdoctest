import { useEffect, useState } from 'react';

const KEYBOARD_OPEN_THRESHOLD = 80;

/**
 * Ajusta área visível do teste no mobile (~50% da viewport) sem translateY agressivo.
 * Desktop/tablet largo: no-op.
 */
export function useMobileKeyboardOffset(enabled) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return undefined;
    }

    const vv = window.visualViewport;
    if (!vv) {
      return undefined;
    }

    const update = () => {
      const vh = vv.height || window.innerHeight;
      const halfViewport = Math.round(vh * 0.5);
      const keyboardOffset = Math.max(0, window.innerHeight - vh - vv.offsetTop);

      document.documentElement.style.setProperty('--vh-adjusted', `${halfViewport}px`);
      document.documentElement.style.setProperty('--visual-viewport-height', `${vh}px`);
      document.documentElement.style.setProperty('--visual-viewport-offset-top', `${vv.offsetTop}px`);
      document.documentElement.style.setProperty('--keyboard-offset', '0px');

      setKeyboardOpen(keyboardOffset > KEYBOARD_OPEN_THRESHOLD);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    window.addEventListener('orientationchange', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      window.removeEventListener('orientationchange', update);
      document.documentElement.style.removeProperty('--vh-adjusted');
      document.documentElement.style.removeProperty('--visual-viewport-height');
      document.documentElement.style.removeProperty('--visual-viewport-offset-top');
      document.documentElement.style.removeProperty('--keyboard-offset');
      setKeyboardOpen(false);
    };
  }, [enabled]);

  return { keyboardOpen };
}
