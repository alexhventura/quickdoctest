import { STORAGE_KEYS } from '@/constants/rankings';
import { localeToNationality, parseGoogleJwt } from './parseGoogleJwt';

const AUTH_KEY = STORAGE_KEYS.auth;

export function loadStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_KEY);
}

/** Converte credencial Google em perfil do app */
export function profileFromGoogleCredential(credential) {
  const decoded = parseGoogleJwt(credential);
  if (!decoded) return null;

  const locale = decoded.locale || navigator.language || 'en-US';

  return {
    name: decoded.name || '',
    email: decoded.email || '',
    picture: decoded.picture || '',
    locale,
    nationality: localeToNationality(locale),
    sub: decoded.sub,
  };
}
