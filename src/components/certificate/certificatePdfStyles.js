/**
 * Paleta exclusiva HEX/RGB para certificado e exportação PDF.
 * Não usar lab(), oklab(), color-mix() ou utilitários Tailwind aqui.
 */
export const PDF_COLORS = {
  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  blue600: '#2563eb',
  navy700: '#1e3a5f',
  navy600: '#2a5080',
  navy500: '#3d6a9e',
  borderLight: '#e2e8f0',
  borderWhite: '#ffffff',
  cardBorder: '#cbd5e1',
  cardBg: '#ffffff',
  frameBorder: '#d1d5db',
};

/** Prévia na app (Inter via Google Fonts do site). */
export const PDF_FONTS = {
  preview: "'Inter', system-ui, -apple-system, sans-serif",
  /** Export PDF: fonte do sistema — html2canvas renderiza espaços corretamente. */
  export: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  mono: 'Consolas, Courier New, monospace',
};

export function getCertificateFont(forPdfExport = false) {
  return forPdfExport ? PDF_FONTS.export : PDF_FONTS.preview;
}

/** Tipografia do cabeçalho — sem letter-spacing customizado. */
export const PDF_HEADER_TYPE = {
  brand: { fontSize: 28, fontWeight: 700, lineHeight: 1.35 },
  title: { fontSize: 16, fontWeight: 700, lineHeight: 1.4 },
  standard: { fontWeight: 600, lineHeight: 1.45 },
  subtitle: { fontSize: 14, fontWeight: 600, lineHeight: 1.45 },
  name: { fontWeight: 700, lineHeight: 1.3 },
  email: { fontWeight: 500, lineHeight: 1.35 },
  rank: { fontSize: 14, fontWeight: 700, lineHeight: 1.4 },
};

/** CSS do iframe de exportação — sem Google Fonts externas. */
export const PDF_EXPORT_BASE_CSS = `
  html, body {
    margin: 0;
    padding: 0;
    background: ${PDF_COLORS.white};
    color: ${PDF_COLORS.slate900};
    font-family: ${PDF_FONTS.export};
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  img {
    display: block;
    max-width: 100%;
  }
  #qd-pdf-capture-host,
  #qd-pdf-capture-host * {
    font-family: ${PDF_FONTS.export} !important;
    letter-spacing: normal !important;
    word-spacing: normal !important;
    font-kerning: normal !important;
    font-variant-ligatures: none !important;
    hyphens: none !important;
    white-space: normal !important;
  }
`;
