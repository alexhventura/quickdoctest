export const DEFAULT_RANK = {
  rankKey: 'incipient',
  rankStyle: 'bg-red-100 text-red-800 border-red-300',
};

export const RANK_TIERS = [
  {
    minNetWpm: 80,
    rankKey: 'elite',
    rankStyle: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
  },
  {
    minNetWpm: 60,
    rankKey: 'professional',
    rankStyle: 'bg-blue-100 text-blue-900 border-blue-400 font-bold',
  },
  {
    minNetWpm: 40,
    rankKey: 'intermediate',
    rankStyle: 'bg-emerald-100 text-emerald-900 border-emerald-400',
  },
  {
    minNetWpm: 20,
    rankKey: 'beginner',
    rankStyle: 'bg-orange-100 text-orange-900 border-orange-400',
  },
];

export const INITIAL_RESULTS = {
  netWpm: 0,
  grossWpm: 0,
  avgWpm: 0,
  accuracy: 0,
  adjustedAccuracy: 0,
  consistency: 0,
  burstSpeed: 0,
  cpm: 0,
  errorRate: 0,
  efficiencyFactor: 0,
  performanceScore: 0,
  wpmStdDev: 0,
  totalToques: 0,
  errosGlobais: 0,
  corrigidos: 0,
  ignorados: 0,
  permanecem: 0,
  correctChars: 0,
  correctWords: 0,
  targetWords: 0,
  latenciaMedia: 0,
  completude: 0,
  testDuration: 30,
  testLang: 'en',
  elapsedSeconds: 0,
  rankKey: DEFAULT_RANK.rankKey,
  rankStyle: DEFAULT_RANK.rankStyle,
  timestamp: '',
};

export { TEST_DURATIONS } from '@/constants/typingSpecs';

export const STORAGE_KEYS = {
  theme: 'qd_theme',
  lang: 'qd_lang',
  auth: 'qd_auth_user',
  best: (lang, duration) => `qd_best_${lang}_${duration}`,
  ghost: (lang, duration) => `qd_ghost_${lang}_${duration}`,
};
