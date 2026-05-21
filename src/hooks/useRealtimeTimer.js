import { useRef, useCallback } from 'react';
import { calculateInstantWpm, calculateProgress } from '@/utils/typing/wpm';

export function useRealtimeTimer({ duration, onSecondTick, onComplete }) {
  const rafRef = useRef(null);
  const startedAtRef = useRef(null);

  const isActiveRef = useRef(false);
  const completedRef = useRef(false);

  const lastSecondRef = useRef(0);

  const timeLeftRef = useRef(duration);
  const currentInputRef = useRef('');
  const targetLengthRef = useRef(0);

  const cancel = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = null;
    isActiveRef.current = false;
    startedAtRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();

    timeLeftRef.current = duration;
    lastSecondRef.current = 0;
    currentInputRef.current = '';
    completedRef.current = false;
  }, [duration, cancel]);

  const syncInput = useCallback((value) => {
    currentInputRef.current = value;
  }, []);

  const setTargetLength = useCallback((length) => {
    targetLengthRef.current = length;
  }, []);

  const tick = useCallback(
    (now) => {
      if (!isActiveRef.current || completedRef.current) return;

      const elapsedMs = now - startedAtRef.current;

      const elapsedSecFloat = elapsedMs / 1000;
      const elapsedSec = Math.floor(elapsedSecFloat);

      const remaining = Math.max(0, duration - elapsedSec);

      timeLeftRef.current = remaining;

      // 🔥 EMIT SEM PULAR SEGUNDO 0
      if (elapsedSec !== lastSecondRef.current) {
        lastSecondRef.current = elapsedSec;

        const progress = calculateProgress(
          currentInputRef.current.length,
          targetLengthRef.current,
        );

        const instWpm = calculateInstantWpm(
          currentInputRef.current.length,
          Math.max(elapsedSec, 1),
        );

        onSecondTick?.({
          elapsed: elapsedSec,
          instWpm,
          currentProgress: progress,
          timeLeft: remaining,
          elapsedMs,
        });
      }

      // 🔥 FINALIZAÇÃO PRECISA (SEM ATRASO DE FLOOR)
      if (elapsedSecFloat >= duration) {
        completedRef.current = true;
        cancel();
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [duration, onSecondTick, onComplete, cancel],
  );

  const start = useCallback(() => {
    cancel();

    isActiveRef.current = true;
    completedRef.current = false;

    startedAtRef.current = performance.now();

    lastSecondRef.current = -1;
    timeLeftRef.current = duration;

    rafRef.current = requestAnimationFrame(tick);
  }, [duration, cancel, tick]);

  const getElapsedMs = useCallback(() => {
    if (!startedAtRef.current) return 0;
    return performance.now() - startedAtRef.current;
  }, []);

  return {
    isActiveRef,
    timeLeftRef,
    currentInputRef,
    startedAtRef,

    start,
    cancel,
    reset,
    syncInput,
    setTargetLength,
    getElapsedMs,
  };
}