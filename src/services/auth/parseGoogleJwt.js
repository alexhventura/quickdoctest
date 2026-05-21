/** Decodifica JWT do Google OAuth sem dependência extra */
export function parseGoogleJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Extrai nacionalidade/região do locale do Google (ex: pt-BR → BR) */
export function localeToNationality(locale) {
  if (!locale) return 'US';
  const parts = locale.split('-');
  return (parts[1] || parts[0] || 'US').toUpperCase();
}
