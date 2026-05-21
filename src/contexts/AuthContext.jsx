import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fireConfetti } from '@/lib/confetti';
import {
  clearStoredUser,
  loadStoredUser,
  profileFromGoogleCredential,
  saveUser,
} from '@/services/auth/googleAuth';

const AuthContext = createContext(null);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AuthStateProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser());
  const authReady = true;

  const handleGoogleSuccess = useCallback((credentialResponse) => {
    const profile = profileFromGoogleCredential(credentialResponse?.credential);
    if (!profile) return;

    setUser(profile);
    saveUser(profile);
    fireConfetti({ particleCount: 40, spread: 60 });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      authReady,
      isAuthenticated: Boolean(user),
      handleGoogleSuccess,
      handleLogout,
    }),
    [user, authReady, handleGoogleSuccess, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  if (!GOOGLE_CLIENT_ID) {
    if (!import.meta.env.PROD) {
      console.warn('[QuickDoc] VITE_GOOGLE_CLIENT_ID ausente — usando modo dev.');
    }
    return <AuthStateProvider>{children}</AuthStateProvider>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthStateProvider>{children}</AuthStateProvider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
