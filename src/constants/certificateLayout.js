/** ISO A4 Landscape - 72 DPI */
export const A4_LANDSCAPE = {
  width: 841,
  height: 595,
};

export const CERT_FONT = "'Inter', sans-serif";

/* ===========================
   MARGENS E ÁREA SEGURA
=========================== */

export const CERT_MARGIN_MM = 20;

export const PAGE_MM = {
  w: 297,
  h: 210,
};

const MM_TO_PX = A4_LANDSCAPE.width / PAGE_MM.w;

export function mmToPx(mm) {
  return Math.round(mm * MM_TO_PX);
}

export const CERT_SAFE = {
  top: 55,
  right: 75,
  bottom: 55,
  left: 75,
};

export const CERT_CONTENT = {
  width:
    A4_LANDSCAPE.width -
    CERT_SAFE.left -
    CERT_SAFE.right,

  height:
    A4_LANDSCAPE.height -
    CERT_SAFE.top -
    CERT_SAFE.bottom,
};

/* ===========================
   POSICIONAMENTO BASE
=========================== */

export const CERT_LAYOUT_MM = {
  brand: 6,
  subtitle: 14,
  meta: 20,

  certify: 34,
  name: 46,
  email: 58,

  level: 65,
  divider: 72,

  cardTop: 82,
  cardHeight: 52,

  footerBrand: 138,
  footerIssued: 144,
  footerQr: 149,
  footerAuth: 166,
  footerContact: 171,
};

/* ===========================
   CARD DE MÉTRICAS
=========================== */

export const CERT_CARD_MM = {
  width: 210,
  maxWidthRatio: 0.90,
};

/* ===========================
   ESPAÇAMENTOS
=========================== */

export const CERT_SPACE = {
  titleToSubtitle: 8,

  subtitleToMeta: 8,

  metaToCertify: 20,

  certifyToName: 18,

  nameToEmail: 5,

  emailToLevel: 10,

  levelToDivider: 18,

  levelToResults: 28,

  resultsToFooter: 24,
};

/* ===========================
   CORES
=========================== */

export const CERT_COLORS = {
  primary: '#863BFF',
  primaryDark: '#7E14FF',
  accent: '#47BFFF',
  accentSoft: '#EDE6FF',

  navy: '#863BFF',

  navyMuted: 'rgba(134,59,255,0.35)',

  /** Texto do certificado — preto (substitui cinzas / off-white) */
  text: '#000000',
  grayDark: '#000000',
  grayMid: '#000000',
  grayLight: '#000000',

  white: '#FFFFFF',

  cardBg: 'rgba(255,255,255,0.95)',

  cardBorder: 'rgba(134,59,255,0.12)',

  heroBg: 'rgba(237,230,255,0.55)',

  footerBg: 'rgba(255,255,255,0.92)',
};

/* ===========================
   TIPOGRAFIA PREMIUM
=========================== */

export const CERT_TYPE = {
  brand: {
    size: 34,
    weight: 700,
    letterSpacing: '0.01em',
  },

  subtitle: {
    size: 16,
    weight: 500,
  },

  meta: {
    size: 11,
    weight: 400,
  },

  certify: {
    size: 16,
    weight: 400,
  },

  name: {
    size: 46,
    weight: 700,
    min: 28,
    max: 46,
  },

  email: {
    size: 11,
    weight: 400,
  },

  level: {
    size: 18,
    weight: 600,
  },

  metricHeroLabel: {
    size: 9,
    weight: 600,
  },

  metricHeroValue: {
    size: 26,
    weight: 700,
  },

  metricSecLabel: {
    size: 8,
    weight: 600,
  },

  metricSecValue: {
    size: 14,
    weight: 600,
  },

  footerBrand: {
    size: 13,
    weight: 700,
  },

  footerMeta: {
    size: 10,
    weight: 400,
  },

  footerAuth: {
    size: 10,
    weight: 700,
  },
};

/* ===========================
   TAMANHO DINÂMICO DO NOME
=========================== */

export function getCertificateNameSize(name = '') {
  const len = String(name).trim().length;

  if (len <= 18) return 46;

  if (len <= 28) return 42;

  if (len <= 38) return 36;

  if (len <= 48) return 32;

  return 28;
}

/* ===========================
   LEGACY
=========================== */

export const CERT_CONTENT_WIDTH =
  CERT_CONTENT.width;

export const CERT_MARGIN =
  CERT_SAFE.top;