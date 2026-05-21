import { useRef, useCallback } from 'react';

export function usePerformanceMetrics() {
  const totalKeystrokesRef = useRef(0);
  const errorsRef = useRef(0);
  const correctedRef = useRef(0);
  const lastKeyTimeRef = useRef(null);
  const latenciesRef = useRef([]);

  const resetMetrics = useCallback(() => {
    totalKeystrokesRef.current = 0;
    errorsRef.current = 0;
    correctedRef.current = 0;
    lastKeyTimeRef.current = null;
    latenciesRef.current = [];
  }, []);

  const recordKeystrokeLatency = useCallback((timestamp) => {
    if (lastKeyTimeRef.current) {
      latenciesRef.current.push(timestamp - lastKeyTimeRef.current);
    }
    lastKeyTimeRef.current = timestamp;
  }, []);

  const recordCorrection = useCallback(() => {
    correctedRef.current += 1;
  }, []);

  const recordKeystroke = useCallback((isCorrect) => {
    totalKeystrokesRef.current += 1;
    if (!isCorrect) errorsRef.current += 1;
  }, []);

  const getSnapshot = useCallback(
    () => ({
      totalKeystrokes: totalKeystrokesRef.current,
      totalErrors: errorsRef.current,
      correctedCount: correctedRef.current,
      latencies: [...latenciesRef.current],
    }),
    [],
  );

  const getLiveAccuracy = useCallback(() => {
    const total = totalKeystrokesRef.current;
    if (total === 0) return 100;
    return Math.round(((total - errorsRef.current) / total) * 100);
  }, []);

  return {
    resetMetrics,
    recordKeystrokeLatency,
    recordCorrection,
    recordKeystroke,
    getSnapshot,
    getLiveAccuracy,
  };
}
