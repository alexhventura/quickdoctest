import { DEFAULT_RANK, RANK_TIERS } from '@/constants/rankings';

export function getRank(netWpm, totalKeystrokes, completionPercent) {
  if (totalKeystrokes <= 5 || completionPercent < 15) {
    return { ...DEFAULT_RANK };
  }

  const tier = RANK_TIERS.find(({ minNetWpm }) => netWpm >= minNetWpm);
  if (!tier) {
    return { ...DEFAULT_RANK };
  }

  return {
    rankKey: tier.rankKey,
    rankStyle: tier.rankStyle,
  };
}
