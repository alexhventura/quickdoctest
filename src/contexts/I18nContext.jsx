import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '@/constants/rankings';
import { detectLanguage } from '@/i18n';
import i18n from '@/i18n';
import { LANGUAGE_CODES } from '@/constants/languages';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);
  const { t, i18n: i18nInstance } = useTranslation();

  const setLang = useCallback((code) => {
    const safe = LANGUAGE_CODES.includes(code) ? code : 'en';
    setLangState(safe);
    i18n.changeLanguage(safe);
    localStorage.setItem(STORAGE_KEYS.lang, safe);
    document.documentElement.lang = safe === 'pt' ? 'pt-BR' : safe === 'es' ? 'es' : 'en';
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      labels: {
        title: t('title'),
        subtitle: t('subtitle'),
        netWpm: t('netWpm'),
        accuracy: t('accuracy'),
        consistency: t('consistency'),
        peakWpm: t('peakWpm'),
        wpmDetail: t('wpmDetail'),
        accDetail: t('accDetail'),
        conDetail: t('conDetail'),
        peakDetail: t('peakDetail'),
        chartTitle: t('chartTitle'),
        repeatBtn: t('repeatBtn'),
        certBtn: t('certBtn'),
        loginAlert: t('loginAlert'),
        rights: t('rights'),
        loading: t('loading'),
        loadingSubtitle: t('loadingSubtitle'),
        loadingCountdown: t('loadingCountdown'),
        hudWpm: t('hudWpm'),
        hudAcc: t('hudAcc'),
        hudTime: t('hudTime'),
        tabHint: t('tabHint'),
        googleLogin: t('googleLogin'),
        googleLogout: t('googleLogout'),
        themeLight: t('themeLight'),
        themeDark: t('themeDark'),
        adLabel: t('adLabel'),
        adPlaceholder: t('adPlaceholder'),
        adPopupTitle: t('adPopupTitle'),
        adPopupClose: t('adPopupClose'),
        adPopupWait: t('adPopupWait'),
        emailSending: t('emailSending'),
        emailSent: t('emailSent'),
        emailFailed: t('emailFailed'),
        shareHint: t('shareHint'),
        chartLoading: t('chartLoading'),
      },
    }),
    [lang, setLang, t, i18nInstance.language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
