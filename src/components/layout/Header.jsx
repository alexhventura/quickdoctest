import { memo, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Check } from 'lucide-react';
import { LANGUAGE_LABELS, LANGUAGE_CODES } from '@/constants/languages';
import { stripLocalePrefix, useLocalePath } from '@/hooks/useLocalePath';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import UserMenu from '@/components/auth/UserMenu';
import qtLogo from '@/assets/QT_V2.png';

function Header({ themeStyles }) {
  const { lang, setLang, dropdownOpen, setDropdownOpen } = useAppStore();
  const { home } = useLocalePath();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();

  const { card } = themeStyles;
  const menuRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, setDropdownOpen]);

  const switchLanguage = useCallback(
    (code) => {
      setLang(code);
      setDropdownOpen(false);
      const suffix = stripLocalePrefix(location.pathname);
      navigate(`/${code}${suffix}`, { replace: true });
    },
    [setLang, setDropdownOpen, location.pathname, navigate],
  );

  return (
    <header
      style={card}
      className="border-b border-slate-200/80 dark:border-white/5 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md transition-colors duration-300"
    >
      <Link
        to={home}
        className="flex items-center gap-2.5 sm:gap-3 min-w-0 hover:opacity-90 transition-opacity"
        aria-label="QuickDocTest — início"
      >
        <img
          src={qtLogo}
          alt=""
          className="h-8 w-auto sm:h-9 shrink-0 object-contain"
        />
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span
            className={`font-sans font-extrabold tracking-wider uppercase text-lg sm:text-xl truncate ${
              isDark ? 'text-white' : 'text-blue-900'
            }`}
          >
            QUICKDOC
          </span>
          <span className="font-light italic text-lg sm:text-xl text-blue-500 shrink-0">
            Test
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="qd-btn-ghost flex items-center gap-1.5 text-sm font-medium px-2.5 sm:px-3.5 py-2 rounded-lg border transition-all"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <Globe size={15} aria-hidden />
            <span className="hidden xs:inline sm:inline">{LANGUAGE_LABELS[lang]}</span>
            <span className="text-[10px] qd-text-subtle" aria-hidden>
              ▾
            </span>
          </button>

          {dropdownOpen && (
            <ul className="qd-lang-menu" role="listbox" aria-label="Language">
              {LANGUAGE_CODES.map((code) => (
                <li key={code} role="option" aria-selected={lang === code}>
                  <button
                    type="button"
                    onClick={() => switchLanguage(code)}
                    className={`qd-lang-option ${
                      lang === code ? 'qd-lang-option--active' : ''
                    }`}
                  >
                    <span className="flex items-center justify-between w-full gap-3">
                      {LANGUAGE_LABELS[code]}
                      {lang === code && <Check size={14} aria-hidden />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="qd-btn-ghost p-2 rounded-lg border transition-all hover:scale-105"
          aria-label={isDark ? t('themeLight') : t('themeDark')}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400" aria-hidden />
          ) : (
            <Moon size={18} className="text-slate-600" aria-hidden />
          )}
        </button>

        {user ? <UserMenu themeStyles={themeStyles} /> : <GoogleLoginButton />}
      </div>
    </header>
  );
}

export default memo(Header);
