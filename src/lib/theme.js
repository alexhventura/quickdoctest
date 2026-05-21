export function getThemeStyles(theme) {
  const isDark = theme === 'dark';

  return {
    isDark,
    root: {
      backgroundColor: isDark ? '#0a0a0c' : '#f8fafc',
      color: isDark ? '#f4f4f5' : '#1e40af',
    },
    card: {
      backgroundColor: isDark ? 'rgb(12 12 14 / 0.85)' : 'rgb(255 255 255 / 0.9)',
      borderColor: isDark ? 'rgb(255 255 255 / 0.06)' : 'rgb(30 64 175 / 0.1)',
      color: isDark ? '#f4f4f5' : '#1e40af',
    },
  };
}
