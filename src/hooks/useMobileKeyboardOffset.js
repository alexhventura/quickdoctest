import { useEffect, useState } from 'react';

const KEYBOARD_OPEN_THRESHOLD = 80;

/**
 * Ajusta --keyboard-offset via visualViewport (somente mobile).
 * Desktop: no-op, sem alterar CSS global.
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
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--keyboard-offset', `${offset}px`);
      document.documentElement.style.setProperty('--visual-viewport-height', `${vv.height}px`);
      document.documentElement.style.setProperty('--visual-viewport-offset-top', `${vv.offsetTop}px`);
      setKeyboardOpen(offset > KEYBOARD_OPEN_THRESHOLD);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    window.addEventListener('orientationchange', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      window.removeEventListener('orientationchange', update);
      document.documentElement.style.removeProperty('--keyboard-offset');
      document.documentElement.style.removeProperty('--visual-viewport-height');
      document.documentElement.style.removeProperty('--visual-viewport-offset-top');
      setKeyboardOpen(false);
    };
  }, [enabled]);

  return { keyboardOpen };
}
