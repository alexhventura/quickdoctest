import { useEffect, useState } from 'react';

const KEYBOARD_OPEN_THRESHOLD = 72;

function isCompactViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches;
}

/**
 * Fixa HUD + área de digitação no topo da viewport visível quando o teclado abre (mobile/tablet).
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

    const mq = window.matchMedia('(max-width: 768px)');
    let scrollRaf = 0;

    const syncScrollToVisibleTop = () => {
      const top = Math.max(0, vv.offsetTop || 0);
      window.scrollTo({ top, left: 0, behavior: 'instant' });
    };

    const setBodyLock = (open) => {
      if (open) {
        document.body.classList.add('qd-keyboard-open');
        document.documentElement.classList.add('qd-keyboard-open');
      } else {
        document.body.classList.remove('qd-keyboard-open');
        document.documentElement.classList.remove('qd-keyboard-open');
      }
    };

    const update = () => {
      if (!mq.matches || !isCompactViewport()) {
        setKeyboardOpen(false);
        setBodyLock(false);
        return;
      }

      const visibleHeight = vv.height || window.innerHeight;
      const offsetTop = Math.max(0, vv.offsetTop || 0);
      const keyboardOffset = Math.max(0, window.innerHeight - visibleHeight - offsetTop);
      const open = keyboardOffset > KEYBOARD_OPEN_THRESHOLD;

      document.documentElement.style.setProperty('--visual-viewport-height', `${visibleHeight}px`);
      document.documentElement.style.setProperty('--visual-viewport-offset-top', `${offsetTop}px`);

      setKeyboardOpen(open);
      setBodyLock(open);

      if (open) {
        cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => {
          syncScrollToVisibleTop();
          requestAnimationFrame(syncScrollToVisibleTop);
        });
      }
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    mq.addEventListener('change', update);
    window.addEventListener('orientationchange', update);

    return () => {
      cancelAnimationFrame(scrollRaf);
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      mq.removeEventListener('change', update);
      window.removeEventListener('orientationchange', update);
      setBodyLock(false);
      document.documentElement.style.removeProperty('--visual-viewport-height');
      document.documentElement.style.removeProperty('--visual-viewport-offset-top');
      setKeyboardOpen(false);
    };
  }, [enabled]);

  return { keyboardOpen };
}
