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

export const PDF_FONTS = {
  body: "'Inter', system-ui, sans-serif",
  mono: 'monospace',
};

/** Estilos base injetados no iframe de exportação (sem Tailwind). */
export const PDF_EXPORT_BASE_CSS = `
  html, body {
    margin: 0;
    padding: 0;
    background: ${PDF_COLORS.white};
    color: ${PDF_COLORS.slate900};
    font-family: ${PDF_FONTS.body};
    -webkit-font-smoothing: antialiased;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  img {
    display: block;
    max-width: 100%;
  }
`;
