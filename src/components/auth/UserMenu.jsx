import { memo } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

function UserMenu({ themeStyles }) {
  const { user, handleLogout } = useAuth();
  const { t } = useI18n();
  const { root } = themeStyles;

  if (!user) return null;

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={root}
      className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
      role="group"
      aria-label={user.name}
    >
      {user.picture ? (
        <img
          src={user.picture}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
          aria-hidden
        >
          {initials}
        </span>
      )}

      <div className="hidden sm:block text-left max-w-[120px]">
        <p className="text-xs font-semibold truncate">{user.name}</p>
        <p className="text-[10px] qd-text-subtle truncate">{user.email}</p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="p-1.5 text-red-400 hover:text-red-300 rounded-md transition-colors"
        aria-label={t('googleLogout')}
        title={t('googleLogout')}
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}

export default memo(UserMenu);
