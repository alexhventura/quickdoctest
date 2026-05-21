import { getRank } from '@/services/ranking/getRank';
import { countOmissionErrors, countRemainingErrors } from '@/utils/typing/errors';
import { calculateGrossWpm, calculateNetWpm } from '@/utils/typing/wpm';
import { formatResultTimestamp } from '@/utils/formatting/date';
import { averageLatency } from '@/utils/performance/latency';
import {
  calculateCpm,
  calculateCorrectChars,
  calculateOfficialConsistency,
  calculateAdjustedAccuracy,
  calculateErrorRate,
  calculateEfficiencyFactor,
  calculatePerformanceScore,
  calculateWpmStdDev,
} from './officialMetrics';

export function computeFinalResults({
  duration,
  targetText,
  finalInput,
  chartData,
  totalKeystrokes,
  totalErrors,
  correctedCount,
  latencies,
  elapsedMs,
  lang,
}) {
  const elapsedMinutes =
    elapsedMs && elapsedMs > 0 ? elapsedMs / 60000 : duration / 60;

  const totalCharacters = targetText.length;
  const completionRate =
    totalCharacters > 0 ? finalInput.length / totalCharacters : 0;
  const completionPercent = Math.round(completionRate * 100);

  const correctChars = calculateCorrectChars(finalInput, targetText);
  const grossWpm = calculateGrossWpm(totalKeystrokes, elapsedMinutes);

  const omissionErrors = countOmissionErrors(
    totalCharacters,
    finalInput.length,
  );
  const remainingErrors = countRemainingErrors(finalInput, targetText);

  const netWpm = calculateNetWpm(grossWpm, remainingErrors, elapsedMinutes);

  const keyboardAccuracy =
    totalKeystrokes > 0
      ? (totalKeystrokes - totalErrors) / totalKeystrokes
      : 0;

  const accuracy = Math.round(keyboardAccuracy * 100);
  const adjustedAccuracy = calculateAdjustedAccuracy(
    keyboardAccuracy,
    completionRate,
  );

  const speeds = chartData.map((p) => p.WPM).filter((w) => w > 0);
  const avgWpm =
    speeds.length > 0
      ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length)
      : netWpm;

  const consistency = calculateOfficialConsistency(speeds);
  const wpmStdDev = Math.round(calculateWpmStdDev(speeds) * 10) / 10;
  const burstSpeed = speeds.length > 0 ? Math.max(...speeds) : netWpm;
  const latenciaMedia = averageLatency(latencies);

  const cpm = calculateCpm(correctChars, elapsedMinutes);
  const errorRate = calculateErrorRate(
    totalErrors + remainingErrors,
    elapsedMinutes,
  );
  const efficiencyFactor = calculateEfficiencyFactor(netWpm, grossWpm);

  const rankData = getRank(netWpm, totalKeystrokes, completionPercent);

  const performanceScore = calculatePerformanceScore({
    netWpm,
    accuracy,
    consistency,
    completude: completionPercent,
  });

  const correctWords = Math.round(correctChars / 5);
  const targetWords = Math.round(totalCharacters / 5);

  return {
    netWpm,
    grossWpm,
    avgWpm,
    accuracy,
    adjustedAccuracy,
    consistency,
    burstSpeed,
    cpm,
    errorRate,
    efficiencyFactor,
    performanceScore,
    wpmStdDev,

    totalToques: totalKeystrokes,
    errosGlobais: totalErrors + omissionErrors,
    corrigidos: correctedCount,
    ignorados: omissionErrors,
    permanecem: remainingErrors,
    correctChars,
    correctWords,
    targetWords,

    latenciaMedia,
    completude: completionPercent,
    testDuration: duration,
    testLang: lang || 'en',
    elapsedSeconds: Math.round(elapsedMinutes * 60),

    ...rankData,
    timestamp: formatResultTimestamp(),
  };
}
