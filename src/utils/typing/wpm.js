export function calculateInstantWpm(charCount, elapsedSeconds) {
  const minutes = elapsedSeconds / 60;
  const words = charCount / 5;
  return Math.round(minutes > 0 ? words / minutes : 0);
}

export function calculateGrossWpm(totalKeystrokes, elapsedMinutes) {
  return elapsedMinutes > 0 ? Math.round(totalKeystrokes / 5 / elapsedMinutes) : 0;
}

export function calculateNetWpm(grossWpm, remainingErrors, elapsedMinutes) {
  return Math.max(0, Math.round(grossWpm - remainingErrors / elapsedMinutes));
}

export function calculateProgress(charIndex, textLength) {
  return textLength > 0 ? (charIndex / textLength) * 100 : 0;
}
