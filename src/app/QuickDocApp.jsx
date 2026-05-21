import { useMemo, useCallback, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeStyles } from '@/lib/theme';
import { useTypingRealtimeEngine } from '@/hooks/useTypingRealtimeEngine';
import { useSeo } from '@/hooks/useSeo';
import AdPlaceholder from '@/components/ads/AdPlaceholder';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdSidebar from '@/components/layout/AdSidebar';
import TypingScreen from '@/components/typing/TypingScreen';
import LoadingScreen from '@/components/results/LoadingScreen';
import ResultsScreen from '@/components/results/ResultsScreen';
import AdSensePopup from '@/components/ads/AdSensePopup';
import CertificateModal from '@/components/certificate/CertificateModal';

export default function QuickDocApp() {
  const { lang, theme } = useAppStore();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const themeStyles = useMemo(() => getThemeStyles(theme), [theme]);
  const [emailStatus, setEmailStatus] = useState(null);

  useSeo({ lang });

  const onEmailStatus = useCallback((status) => setEmailStatus(status), []);

  const typing = useTypingRealtimeEngine({ lang, user, onEmailStatus });

  const handleCloseCertificate = useCallback(() => {
    typing.setShowCertificado(false);
    document.body.style.overflow = '';
  }, [typing.setShowCertificado]);

  const handlePreviewCertificate = useCallback(() => {
    if (!user) return;
    typing.setShowCertificado(true);
  }, [user, typing.setShowCertificado]);

  const focusClass = typing.focusMode ? 'qd-focus-mode' : '';

  useEffect(() => {
    if (typing.screen === 'resultados' || typing.screen === 'teste') {
      document.body.style.overflow = '';
      document.getElementById('qd-pdf-capture-host')?.remove();
    }
  }, [typing.screen]);

  return (
    <div
      style={themeStyles.root}
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${focusClass}`}
    >
      {typing.focusMode && <div className="qd-focus-vignette" aria-hidden />}

      <div className="qd-dim-when-focus">
        <Header themeStyles={themeStyles} />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 lg:px-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="qd-dim-when-focus qd-side-blur hidden lg:block">
          <AdSidebar />
        </div>

        <section className="lg:col-span-3 flex flex-col justify-start">
          <AnimatePresence mode="sync">
            {typing.screen === 'teste' && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TypingScreen
                  themeStyles={themeStyles}
                  isDark={isDark}
                  duration={typing.duration}
                  onDurationChange={typing.setDuration}
                  typingAreaRef={typing.typingAreaRef}
                  onNativeInput={typing.handleNativeInput}
                  focusMode={typing.focusMode}
                  hudWpmRef={typing.hudWpmRef}
                  hudAccRef={typing.hudAccRef}
                  hudTimerRef={typing.hudTimerRef}
                  targetText={typing.targetText}
                />
              </motion.div>
            )}

            {typing.screen === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                <LoadingScreen
                  themeStyles={themeStyles}
                  loadingProgress={typing.loadingProgress}
                  loadingSecondsLeft={typing.loadingSecondsLeft}
                  emailStatus={emailStatus}
                  user={user}
                />
              </motion.div>
            )}

            {typing.screen === 'resultados' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-6 flex justify-center">
                  <AdPlaceholder variant="responsive" className="w-full max-w-2xl" />
                </div>
                <ResultsScreen
                  themeStyles={themeStyles}
                  results={typing.results}
                  chartData={typing.chartData}
                  onRepeat={typing.resetTest}
                  onPreviewCertificate={handlePreviewCertificate}
                  emailStatus={emailStatus}
                  user={user}
                  lang={lang}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="qd-dim-when-focus qd-side-blur hidden lg:block">
          <AdSidebar />
        </div>
      </main>

      <AdSensePopup
        open={typing.showAdPopup && typing.screen === 'loading'}
        secondsLeft={typing.loadingSecondsLeft}
        onClose={typing.dismissAdPopup}
        themeStyles={themeStyles}
      />

      {typing.showCertificado && user && (
        <CertificateModal
          results={typing.results}
          user={user}
          lang={lang}
          onClose={handleCloseCertificate}
        />
      )}

      <div className="qd-dim-when-focus px-4 pb-2">
        <div className="max-w-3xl mx-auto mb-3">
          <AdPlaceholder variant="responsive" />
        </div>
        <Footer themeStyles={themeStyles} />
      </div>
    </div>
  );
}
