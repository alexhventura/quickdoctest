/**
 * Store legado — reexporta hooks dos contexts para compatibilidade.
 * Prefira useAuth, useTheme, useI18n nos novos componentes.
 */
import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const auth = useAuth();
  const themeCtx = useTheme();
  const i18n = useI18n();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleGoogleLogin = useCallback(() => {
    /* Login real via GoogleLoginButton; mantido para APIs antigas */
  }, []);

  const value = useMemo(
    () => ({
      lang: i18n.lang,
      setLang: i18n.setLang,
      theme: themeCtx.theme,
      setTheme: themeCtx.setTheme,
      toggleTheme: themeCtx.toggleTheme,
      user: auth.user,
      setUser: auth.setUser,
      dropdownOpen,
      setDropdownOpen,
      handleGoogleLogin,
      handleLogout: auth.handleLogout,
      labels: i18n.labels,
      t: i18n.t,
    }),
    [auth, themeCtx, i18n, dropdownOpen, handleGoogleLogin],
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
