/**
 * Diretrizes internacionais para testes de digitação (padrão 5 caracteres = 1 palavra).
 * Calibração alinhada a benchmarks Monkeytype / Typing.com / normas clericais ISO-adjacentes.
 */
export const TEST_DURATIONS = [15, 30, 60];

/** Metas de caracteres por duração (tipista médio 40–55 WPM) */
export const DURATION_SPECS = {
  15: {
    labelKey: 'duration15',
    targetChars: { min: 100, max: 145 },
    expectedWords: '20–28',
    standard: 'Sprint assessment',
  },
  30: {
    labelKey: 'duration30',
    targetChars: { min: 220, max: 300 },
    expectedWords: '44–60',
    standard: 'Intermediate timed test',
  },
  60: {
    labelKey: 'duration60',
    targetChars: { min: 460, max: 620 },
    expectedWords: '92–124',
    standard: 'Full professional timed test',
  },
};
