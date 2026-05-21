import { useRef, useState, useCallback } from 'react';
import { calculateInstantWpm, calculateProgress } from '@/utils/typing/wpm';

export function useTimerEngine({ duration, targetTextLength, onTick, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);
  const timeLeftRef = useRef(duration);
  const isActiveRef = useRef(false);
  const currentInputRef = useRef('');

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    timeLeftRef.current = duration;
    setTimeLeft(duration);
    currentInputRef.current = '';
  }, [duration, stopTimer]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    isActiveRef.current = true;
    timerRef.current = setInterval(() => {
      if (timeLeftRef.current > 0 && isActiveRef.current) {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);

        const elapsed = duration - timeLeftRef.current;
        const currentInput = currentInputRef.current;
        const currentProgress = calculateProgress(currentInput.length, targetTextLength);
        const instWpm = calculateInstantWpm(currentInput.length, elapsed);

        onTick?.({ elapsed, instWpm, currentProgress });

        if (timeLeftRef.current === 0) {
          stopTimer();
          onComplete?.();
        }
      }
    }, 1000);
  }, [duration, targetTextLength, onTick, onComplete, stopTimer]);

  const syncInput = useCallback((value) => {
    currentInputRef.current = value;
  }, []);

  return {
    timeLeft,
    isActiveRef,
    currentInputRef,
    startTimer,
    stopTimer,
    resetTimer,
    syncInput,
  };
}
