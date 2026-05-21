export function getCharClasses(isDark) {
  return {
    pending: isDark ? 'text-black/45' : 'text-blue-400',
    correct: isDark ? 'text-black' : 'text-blue-900',
    error: isDark
      ? 'text-red-600 underline decoration-red-500/70 underline-offset-4'
      : 'text-red-600 underline decoration-red-400/50 underline-offset-4',
  };
}

export function resolveCharClass(index, input, target, classes) {
  if (index >= input.length) return classes.pending;
  return input[index] === target[index] ? classes.correct : classes.error;
}
