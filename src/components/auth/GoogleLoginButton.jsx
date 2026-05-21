import { memo } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function GoogleLoginButton() {
  const { handleGoogleSuccess } = useAuth();
  const { t } = useI18n();

  if (!GOOGLE_CLIENT_ID) {
    if (import.meta.env.PROD) {
      return (
        <span className="text-[10px] text-amber-500 px-2 max-w-[140px] text-center">
          {t('googleLoginUnavailable')}
        </span>
      );
    }
    return <DevLoginFallback label={t('googleLogin')} />;
  }

  return (
    <div className="qd-google-login-wrap" role="group" aria-label={t('googleLogin')}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.warn('[QuickDoc] Google login cancelado ou falhou')}
        theme="outline"
        size="medium"
        text="signin_with"
        shape="pill"
        width="200"
      />
    </div>
  );
}

function DevLoginFallback({ label }) {
  const { handleGoogleSuccess } = useAuth();

  const mockLogin = () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        name: 'Alex Ventura',
        email: 'dev@quickdoc.test',
        picture: '',
        locale: navigator.language || 'pt-BR',
        sub: 'dev-user',
      }),
    );
    handleGoogleSuccess({ credential: `${header}.${payload}.sig` });
  };

  return (
    <button
      type="button"
      onClick={mockLogin}
      className="flex items-center gap-2 border border-white/10 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-zinc-200 hover:border-white/20 transition-all hover:scale-[1.02] bg-white/5"
    >
      <LogIn size={14} className="text-blue-500" aria-hidden />
      {label}
    </button>
  );
}

export default memo(GoogleLoginButton);
