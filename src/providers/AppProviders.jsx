import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { AppStoreProvider } from '@/store/appStore';

/** Encadeia todos os providers da aplicação */
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          <AppStoreProvider>{children}</AppStoreProvider>
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
