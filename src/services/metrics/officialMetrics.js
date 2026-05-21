/**
 * Métricas alinhadas a testes oficiais de digitação (padrão internacional 5 chars = 1 palavra).
 */

export function calculateCpm(correctChars, elapsedMinutes) {
  if (!elapsedMinutes || elapsedMinutes <= 0) return 0;
  return Math.round(correctChars / elapsedMinutes);
}

export function calculateCorrectChars(finalInput, targetText) {
  let correct = 0;
  const len = Math.min(finalInput.length, targetText.length);
  for (let i = 0; i < len; i++) {
    if (finalInput[i] === targetText[i]) correct++;
  }
  return correct;
}

/** Desvio padrão do WPM por segundo (menor = mais consistente) */
export function calculateWpmStdDev(speeds) {
  if (!speeds.length) return 0;
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const variance =
    speeds.reduce((sum, v) => sum + (v - mean) ** 2, 0) / speeds.length;
  return Math.sqrt(variance);
}

/** Consistência oficial: 100 - coeficiente de variação penalizado */
export function calculateOfficialConsistency(speeds) {
  const active = speeds.filter((w) => w > 0);
  if (active.length < 2) return active[0] > 0 ? 100 : 0;

  const mean = active.reduce((a, b) => a + b, 0) / active.length;
  if (mean === 0) return 0;

  const stdDev = calculateWpmStdDev(active);
  const cv = (stdDev / mean) * 100;
  return Math.round(Math.max(0, Math.min(100, 100 - cv * 1.2)));
}

/** Precisão ajustada pela completude do texto */
export function calculateAdjustedAccuracy(keyboardAccuracy, completionRate) {
  return Math.round(keyboardAccuracy * (0.7 + 0.3 * completionRate) * 100);
}

/** Erros por minuto (taxa de falha) */
export function calculateErrorRate(totalErrors, elapsedMinutes) {
  if (!elapsedMinutes || elapsedMinutes <= 0) return 0;
  return Math.round((totalErrors / elapsedMinutes) * 10) / 10;
}

/** Fator de eficiência: net / gross (0–100) */
export function calculateEfficiencyFactor(netWpm, grossWpm) {
  if (!grossWpm || grossWpm <= 0) return 0;
  return Math.round((netWpm / grossWpm) * 100);
}

/** Score composto para ranking (0–100) */
export function calculatePerformanceScore({
  netWpm,
  accuracy,
  consistency,
  completude,
}) {
  const speedScore = Math.min(100, (netWpm / 100) * 100);
  const weighted =
    speedScore * 0.35 +
    accuracy * 0.3 +
    consistency * 0.2 +
    completude * 0.15;
  return Math.round(Math.min(100, weighted));
}
