import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ChevronDown,
  Download,
  Mail,
  Share2,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import {
  buildCertificateCopy,
  actionDownloadPdf,
  actionSendEmail,
  actionShareLink,
} from '@/services/certificate/certificateActions';
import { getCertificateRankLabel } from '@/utils/certificate/certificateMetrics';

function Feedback({ message, type }) {
  if (!message) return null;
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const colors =
    type === 'success'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';

  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center gap-2 text-xs py-2 px-3 rounded-lg border ${colors}`}
      role="status"
    >
      <Icon size={14} aria-hidden />
      {message}
    </motion.p>
  );
}

function CertificateLoginGate({ open, onClose, title, message, dismissLabel }) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-login-gate-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <LogIn size={22} aria-hidden />
        </div>
        <h3
          id="cert-login-gate-title"
          className="text-base font-bold text-slate-900 dark:text-zinc-100"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          {message}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <GoogleLoginButton />
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
          >
            {dismissLabel}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function CertificateActions({
  results,
  user: userProp,
  lang,
  onPreview,
  showPreview = true,
  className = '',
}) {
  const { t } = useI18n();
  const { user: authUser } = useAuth();
  const user = authUser ?? userProp;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const pendingActionRef = useRef(null);
  const loginGateWasOpenRef = useRef(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const copy = useMemo(() => buildCertificateCopy(t, results), [t, results]);
  const shareCopy = useMemo(
    () => ({
      shareTitle: t('certShareTitle'),
      shareText: t('certShareText', {
        name: user?.name || t('certAnonymous'),
        wpm: results.netWpm,
        rank: getCertificateRankLabel(results, t),
      }),
    }),
    [t, user, results],
  );

  const openLoginGate = useCallback((pendingAction = null) => {
    pendingActionRef.current = pendingAction;
    loginGateWasOpenRef.current = true;
    setOpen(false);
    setLoginGateOpen(true);
    setFeedback({ type: 'error', message: t('certLoginRequired') });
  }, [t]);

  const runAction = useCallback(
    async (key, fn) => {
      setBusy(key);
      setFeedback(null);
      try {
        const res = await fn();
        if (res.ok) {
          const msg =
            key === 'download'
              ? t('certDownloadSuccess')
              : key === 'email'
                ? t('certEmailResent', { email: user.email })
                : res.method === 'native'
                  ? t('certShareSuccess')
                  : t('certShareCopied');
          setFeedback({ type: 'success', message: msg });
          if (key === 'download') setOpen(false);
        } else if (res.reason === 'no_email') {
          setFeedback({ type: 'error', message: t('certEmailNoUser') });
        } else if (res.reason === 'not_configured') {
          setFeedback({ type: 'error', message: t('certEmailNotConfigured') });
        } else if (res.reason === 'rate_limit') {
          setFeedback({ type: 'error', message: t('certEmailRateLimit') });
        } else if (res.reason === 'origin_blocked') {
          setFeedback({ type: 'error', message: t('certEmailOrigin') });
        } else if (res.reason === 'template_error') {
          setFeedback({ type: 'error', message: t('certEmailTemplate') });
        } else if (res.reason === 'cancelled') {
          setFeedback(null);
        } else {
          setFeedback({
            type: 'error',
            message:
              key === 'download'
                ? t('certDownloadFailed')
                : key === 'email'
                  ? t('certEmailFailed')
                  : t('certShareFailed'),
          });
        }
      } catch {
        setFeedback({
          type: 'error',
          message:
            key === 'download'
              ? t('certDownloadFailed')
              : key === 'email'
                ? t('certEmailFailed')
                : t('certShareFailed'),
        });
      } finally {
        setBusy(null);
      }
    },
    [t, user],
  );

  const requireAuth = useCallback(
    (pendingAction) => {
      if (!user) {
        openLoginGate(pendingAction);
        return false;
      }
      return true;
    },
    [user, openLoginGate],
  );

  const executePending = useCallback(
    (pending) => {
      if (!pending || !user) return;

      if (pending.type === 'action') {
        if (pending.key === 'download') {
          runAction('download', () => actionDownloadPdf({ user, results, copy, lang }));
        } else if (pending.key === 'email') {
          runAction('email', () => actionSendEmail({ user, results, lang, copy }));
        } else if (pending.key === 'share') {
          runAction('share', () => actionShareLink({ results, user, copy: shareCopy }));
        }
      } else if (pending.type === 'preview') {
        setOpen(false);
        onPreview?.();
      }
    },
    [user, results, copy, shareCopy, lang, runAction, onPreview],
  );

  useEffect(() => {
    if (!user || !loginGateWasOpenRef.current) return;

    loginGateWasOpenRef.current = false;
    setLoginGateOpen(false);
    setFeedback({ type: 'success', message: t('certLoginSuccess') });

    const pending = pendingActionRef.current;
    pendingActionRef.current = null;

    if (pending) {
      executePending(pending);
      return;
    }

    setOpen(true);
  }, [user, executePending, t]);

  const handleMenuToggle = useCallback(() => {
    if (!user) {
      openLoginGate(null);
      return;
    }
    setOpen((v) => !v);
  }, [user, openLoginGate]);

  const actions = [
    {
      id: 'download',
      icon: Download,
      label: t('certActionDownload'),
      hint: t('certActionDownloadHint'),
      onClick: () => {
        if (!requireAuth({ type: 'action', key: 'download' })) return;
        runAction('download', () => actionDownloadPdf({ user, results, copy, lang }));
      },
    },
    {
      id: 'email',
      icon: Mail,
      label: t('certActionEmail'),
      hint: user?.email ? t('certActionEmailHint', { email: user.email }) : t('certEmailNoUser'),
      onClick: () => {
        if (!requireAuth({ type: 'action', key: 'email' })) return;
        runAction('email', () => actionSendEmail({ user, results, lang, copy }));
      },
    },
    {
      id: 'share',
      icon: Share2,
      label: t('certActionShare'),
      hint: t('certActionShareHint'),
      onClick: () => {
        if (!requireAuth({ type: 'action', key: 'share' })) return;
        runAction('share', () => actionShareLink({ results, user, copy: shareCopy }));
      },
    },
    ...(showPreview
      ? [
          {
            id: 'preview',
            icon: Eye,
            label: t('certActionPreview'),
            hint: t('certActionPreviewHint'),
            onClick: () => {
              if (!requireAuth({ type: 'preview' })) return;
              setOpen(false);
              onPreview?.();
            },
          },
        ]
      : []),
  ];

  return (
    <div ref={rootRef} className={`space-y-2 ${className}`}>
      <CertificateLoginGate
        open={loginGateOpen}
        onClose={() => {
          setLoginGateOpen(false);
          loginGateWasOpenRef.current = false;
          pendingActionRef.current = null;
        }}
        title={t('certLoginGateTitle')}
        message={t('certLoginRequired')}
        dismissLabel={t('certLoginDismiss')}
      />

      <div className="relative">
        <button
          type="button"
          onClick={handleMenuToggle}
          disabled={!!busy}
          className="qd-cert-menu-btn w-full sm:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 text-white font-bold py-4 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {busy ? (
            <Loader2 size={18} className="animate-spin" aria-hidden />
          ) : (
            <Award size={18} aria-hidden />
          )}
          <span>{busy ? t('certProcessing') : t('certMenuTitle')}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>

        <AnimatePresence>
          {open && user && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
              role="menu"
            >
              {actions.map(({ id, icon: Icon, label, hint, onClick }) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  disabled={!!busy}
                  onClick={onClick}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-45 disabled:cursor-not-allowed border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors"
                >
                  <span className="mt-0.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                    {busy === id ? (
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                    ) : (
                      <Icon size={16} aria-hidden />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-zinc-100">
                      {label}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                      {hint}
                    </span>
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Feedback message={feedback?.message} type={feedback?.type} />
    </div>
  );
}

export default memo(CertificateActions);
