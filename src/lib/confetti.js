let confettiLoader = null;

async function loadConfetti() {
  if (!confettiLoader) {
    confettiLoader = import('canvas-confetti').then((mod) => mod.default);
  }
  return confettiLoader;
}

export async function fireConfetti(options) {
  const confetti = await loadConfetti();
  confetti(options);
}
