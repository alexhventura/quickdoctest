import { STORAGE_KEYS } from '@/constants/rankings';

export function loadGhostRoute(lang, duration) {
  const savedGhost = localStorage.getItem(STORAGE_KEYS.best(lang, duration));
  return savedGhost ? JSON.parse(savedGhost) : null;
}

export function loadBestScore(lang, duration) {
  return Number(localStorage.getItem(STORAGE_KEYS.best(lang, duration)) || 0);
}

export function saveBestRun(lang, duration, netWpm, chartData) {
  localStorage.setItem(STORAGE_KEYS.best(lang, duration), String(netWpm));
  localStorage.setItem(STORAGE_KEYS.ghost(lang, duration), JSON.stringify(chartData));
}

export function shouldSaveBestRun(netWpm, completionPercent) {
  return netWpm > 0 && completionPercent > 50;
}
