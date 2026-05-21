import { useState, useCallback } from 'react';
import { loadGhostRoute } from '@/services/replay/ghostStorage';

export function useGhostReplay() {
  const [ghostRoute, setGhostRoute] = useState(null);
  const [ghostProgress, setGhostProgress] = useState(0);

  const loadGhost = useCallback((lang, duration) => {
    setGhostRoute(loadGhostRoute(lang, duration));
    setGhostProgress(0);
  }, []);

  const updateGhostProgress = useCallback(
    (elapsedSecond) => {
      if (ghostRoute && ghostRoute[elapsedSecond - 1]) {
        setGhostProgress(ghostRoute[elapsedSecond - 1].progress || 0);
      } else if (ghostRoute) {
        setGhostProgress(100);
      }
    },
    [ghostRoute],
  );

  const resetGhostProgress = useCallback(() => {
    setGhostProgress(0);
  }, []);

  return {
    ghostRoute,
    ghostProgress,
    loadGhost,
    updateGhostProgress,
    resetGhostProgress,
  };
}
