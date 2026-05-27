import { useState, useRef, useCallback, useEffect } from 'react';
import { pickRandomText } from '@/constants/texts';
import { INITIAL_RESULTS } from '@/constants/rankings';
import { computeFinalResults } from '@/services/metrics/computeFinalResults';
import {
  loadBestScore,
  saveBestRun,
  shouldSaveBestRun,
} from '@/services/replay/ghostStorage';
import {
  createKeystrokeTimeline,
  KEYSTROKE_TYPES,
} from '@/services/replay/keystrokeTimeline';
import { sendCertificateEmail } from '@/services/email/sendCertificateEmail';
import { fireConfetti } from '@/lib/confetti';
import { getTestDeviceType } from '@/utils/device/getTestDeviceType';
import { usePerformanceMetrics } from './usePerformanceMetrics';
import { useRealtimeTimer } from './useRealtimeTimer';

const LOADING_MS = 15000;

export function useTypingRealtimeEngine({ lang, user, onEmailStatus, deviceProfile }) {
  const [duration, setDuration] = useState(60);
  const [screen, setScreen] = useState('teste');
  const [targetText, setTargetText] = useState('');
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [chartData, setChartData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingSecondsLeft, setLoadingSecondsLeft] = useState(15);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showCertificado, setShowCertificado] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const typingAreaRef = useRef(null);
  const hudWpmRef = useRef(null);
  const hudAccRef = useRef(null);
  const hudTimerRef = useRef(null);

  const chartDataRef = useRef([]);
  const timelineRef = useRef(createKeystrokeTimeline());
  const pendingResultsRef = useRef(null);

  const screenRef = useRef('teste');
  const targetTextRef = useRef('');
  const durationRef = useRef(60);

  const inputLengthRef = useRef(0);
  const hasFinishedRef = useRef(false);
  const loadingRafRef = useRef(null);
  const inputFocusTsRef = useRef(0);
  const testDeviceTypeRef = useRef('desktop');
  const mobileSignalsRef = useRef({
    reactionMs: 0,
    autoCorrectCount: 0,
    swipeLikeCount: 0,
  });

  const metrics = usePerformanceMetrics();
  const onCompleteRef = useRef(() => {});

  const updateHud = useCallback((timeLeft, elapsedMs) => {
    const len = inputLengthRef.current;

    if (hudTimerRef.current) {
      hudTimerRef.current.textContent =
        timeLeft !== null ? String(timeLeft) : '—';
    }

    if (hudAccRef.current) {
      hudAccRef.current.textContent = String(metrics.getLiveAccuracy());
    }

    if (hudWpmRef.current) {
      if (!elapsedMs || elapsedMs < 500) {
        hudWpmRef.current.textContent = '0';
        return;
      }
      const minutes = elapsedMs / 60000;
      hudWpmRef.current.textContent = String(Math.round(len / 5 / minutes));
    }
  }, [metrics]);

  const showResultsScreen = useCallback(() => {
    if (screenRef.current === 'resultados') return;

    const finalResults = pendingResultsRef.current;
    if (finalResults) {
      setResults(finalResults);
      if (finalResults.netWpm >= loadBestScore(lang, durationRef.current)) {
        fireConfetti({ particleCount: 120, spread: 70 });
      }
    }

    if (loadingRafRef.current) {
      cancelAnimationFrame(loadingRafRef.current);
      loadingRafRef.current = null;
    }

    setShowAdPopup(false);
    setFocusMode(false);
    setScreen('resultados');
    screenRef.current = 'resultados';
    document.body.style.overflow = '';
    document.getElementById('qd-pdf-capture-host')?.remove();
  }, [lang]);

  const timer = useRealtimeTimer({
    duration,
    onSecondTick: ({ elapsed, instWpm, currentProgress, timeLeft, elapsedMs }) => {
      updateHud(timeLeft, elapsedMs);
      chartDataRef.current.push({
        second: elapsed,
        WPM: instWpm,
        progress: currentProgress,
      });
    },
    onComplete: () => onCompleteRef.current(),
  });

  const triggerLoadingScreen = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setScreen('loading');
    screenRef.current = 'loading';
    setLoadingProgress(0);
    setLoadingSecondsLeft(15);
    setShowAdPopup(true);
    setFocusMode(false);

    const snapshot = metrics.getSnapshot();
    const finalInput = timer.currentInputRef.current;
    const elapsedMs = timer.getElapsedMs?.() ?? durationRef.current * 1000;
    const finalResults = computeFinalResults({
      duration: durationRef.current,
      targetText: targetTextRef.current,
      finalInput,
      chartData: chartDataRef.current,
      totalKeystrokes: snapshot.totalKeystrokes,
      totalErrors: snapshot.totalErrors,
      correctedCount: snapshot.correctedCount,
      latencies: snapshot.latencies,
      elapsedMs,
      lang,
    });
    finalResults.deviceType = testDeviceTypeRef.current;
    if (deviceProfile?.isMobileLike) {
      finalResults.mobileMetrics = {
        speed: finalResults.netWpm,
        touchAccuracy: finalResults.accuracy,
        reactionMs: mobileSignalsRef.current.reactionMs,
        autoCorrectCount: mobileSignalsRef.current.autoCorrectCount,
        swipeLikeCount: mobileSignalsRef.current.swipeLikeCount,
      };
    }
    pendingResultsRef.current = finalResults;
    setChartData([...chartDataRef.current]);

    const currentBest = loadBestScore(lang, durationRef.current);
    if (
      finalResults.netWpm >= currentBest &&
      shouldSaveBestRun(finalResults.netWpm, finalResults.completude)
    ) {
      saveBestRun(lang, durationRef.current, finalResults.netWpm, chartDataRef.current);
    }

    if (user?.email) {
      onEmailStatus?.('sending');
      sendCertificateEmail({
        user,
        results: pendingResultsRef.current,
        lang,
      }).then((res) => {
        if (res.ok) onEmailStatus?.('sent');
        else if (res.reason === 'not_configured') onEmailStatus?.('skipped');
        else onEmailStatus?.('failed');
      });
    }

    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min((elapsed / LOADING_MS) * 100, 100);
      const secondsLeft = Math.max(0, Math.ceil((LOADING_MS - elapsed) / 1000));

      setLoadingProgress(progress);
      setLoadingSecondsLeft(secondsLeft);

      if (elapsed < LOADING_MS) {
        loadingRafRef.current = requestAnimationFrame(animate);
      } else {
        showResultsScreen();
      }
    };

    loadingRafRef.current = requestAnimationFrame(animate);
  }, [metrics, showResultsScreen, user, lang, onEmailStatus, timer]);

  useEffect(() => {
    onCompleteRef.current = triggerLoadingScreen;
  }, [triggerLoadingScreen]);

  const finishTest = useCallback(() => {
    if (hasFinishedRef.current) return;
    timer.cancel();
    triggerLoadingScreen();
  }, [timer, triggerLoadingScreen]);

  const resetTest = useCallback(() => {
    hasFinishedRef.current = false;
    if (loadingRafRef.current) cancelAnimationFrame(loadingRafRef.current);

    timer.cancel();
    timer.reset();
    durationRef.current = duration;

    const text = pickRandomText(lang, duration);
    targetTextRef.current = text;
    setTargetText(text);
    timer.setTargetLength(text.length);

    metrics.resetMetrics();
    timelineRef.current.reset();
    timelineRef.current.start({ lang, duration });
    mobileSignalsRef.current = {
      reactionMs: 0,
      autoCorrectCount: 0,
      swipeLikeCount: 0,
    };
    inputFocusTsRef.current = 0;
    testDeviceTypeRef.current = getTestDeviceType();

    chartDataRef.current = [];
    inputLengthRef.current = 0;
    pendingResultsRef.current = null;

    typingAreaRef.current?.mountTarget(text);
    typingAreaRef.current?.resetInput();
    timer.syncInput('');

    setShowCertificado(false);
    setShowAdPopup(false);
    setFocusMode(false);
    setLoadingProgress(0);
    setLoadingSecondsLeft(15);
    setScreen('teste');
    screenRef.current = 'teste';
    document.body.style.overflow = '';
    document.getElementById('qd-pdf-capture-host')?.remove();

    updateHud(duration, 0);
    setTimeout(() => typingAreaRef.current?.focus(), 50);
  }, [lang, duration, timer, metrics, updateHud]);

  useEffect(() => {
    durationRef.current = duration;
    resetTest();
  }, [lang, duration]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Tab' && screenRef.current === 'teste') {
        event.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [resetTest]);

  useEffect(() => {
    return () => {
      if (loadingRafRef.current) cancelAnimationFrame(loadingRafRef.current);
    };
  }, []);

  const handleNativeInput = useCallback(
    (event) => {
      const value = event.target.value;
      const target = targetTextRef.current;
      const nativeType = event?.nativeEvent?.inputType || '';

      if (screenRef.current !== 'teste' || value.length > target.length) {
        event.target.value = timer.currentInputRef.current;
        return;
      }

      const now = performance.now();
      const prev = timer.currentInputRef.current;

      if (!timer.isActiveRef.current && value.length === 1) {
        setFocusMode(true);
        if (deviceProfile?.isMobileLike && inputFocusTsRef.current && !mobileSignalsRef.current.reactionMs) {
          mobileSignalsRef.current.reactionMs = Math.max(
            0,
            Math.round(performance.now() - inputFocusTsRef.current),
          );
        }
        timer.start();
      }

      if (deviceProfile?.isMobileLike) {
        const delta = value.length - prev.length;
        if (delta > 1 && nativeType !== 'insertFromPaste') {
          mobileSignalsRef.current.autoCorrectCount += 1;
          mobileSignalsRef.current.swipeLikeCount += 1;
        } else if (nativeType === 'insertReplacementText') {
          mobileSignalsRef.current.autoCorrectCount += 1;
        }
      }

      metrics.recordKeystrokeLatency(now);

      if (value.length < prev.length) {
        metrics.recordCorrection();
      } else {
        const index = value.length - 1;
        metrics.recordKeystroke(value[index] === target[index]);
      }

      inputLengthRef.current = value.length;
      timer.syncInput(value);
      typingAreaRef.current?.applyInput(value);

      updateHud(timer.timeLeftRef.current, timer.getElapsedMs?.() ?? 0);

      if (value.length === target.length) {
        timer.cancel();
        timelineRef.current.record({
          type: KEYSTROKE_TYPES.COMPLETE,
          timestamp: now,
          inputLength: value.length,
        });
        finishTest();
      }
    },
    [timer, metrics, updateHud, finishTest, deviceProfile],
  );

  const handleTypingAreaFocus = useCallback(() => {
    if (!deviceProfile?.isMobileLike) return;
    if (!timer.isActiveRef.current && !inputFocusTsRef.current) {
      inputFocusTsRef.current = performance.now();
    }
  }, [deviceProfile, timer]);

  const dismissAdPopup = useCallback(() => {
    setShowAdPopup(false);
    if (screenRef.current === 'loading') {
      showResultsScreen();
    }
  }, [showResultsScreen]);

  return {
    duration,
    setDuration,
    screen,
    targetText,
    chartData,
    results,
    loadingProgress,
    loadingSecondsLeft,
    showAdPopup,
    dismissAdPopup,
    showCertificado,
    setShowCertificado,
    focusMode,
    typingAreaRef,
    hudWpmRef,
    hudAccRef,
    hudTimerRef,
    resetTest,
    handleNativeInput,
    handleTypingAreaFocus,
    getTimelineSnapshot: () => timelineRef.current.exportSnapshot(),
  };
}
