import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { buildCertificateCopy } from '@/services/certificate/certificateCopy';
import CertificateDocument, { A4_LANDSCAPE } from './CertificateDocument';
import CertificateActions from './CertificateActions';
import CertificatePreviewScaler from './CertificatePreviewScaler';
import { setCertificatePreview } from './certificatePreviewRegistry';
import { buildCertificateTemplateModel, paginateCertificatePages } from './certificateTemplate';

export default function CertificateModal({ results, user, lang, onClose }) {
  const { t } = useI18n();
  const deviceProfile = useDeviceProfile();
  const previewRef = useRef(null);
  const previewMatchesPdf = Boolean(deviceProfile?.isMobileLike);
  const copy = useMemo(() => buildCertificateCopy(t, results), [t, results]);
  const pageCount = useMemo(
    () => paginateCertificatePages(buildCertificateTemplateModel({ results, user, copy, t })).length,
    [results, user, copy, t],
  );

  useEffect(() => {
    const register = () => {
      const node = previewRef.current;
      if (node) {
        setCertificatePreview(node, {
          timestamp: results?.timestamp,
          userEmail: user?.email,
        });
      }
    };
    register();
    requestAnimationFrame(register);
    return () => setCertificatePreview(null);
  }, [results?.timestamp, user?.email, copy]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleClose = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      onClose();
    },
    [onClose],
  );

  const modal = (
    <div
      className="qd-cert-modal-root fixed inset-0 z-[99999] flex flex-col items-center justify-start p-4 pt-6 sm:pt-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full bg-black/75 backdrop-blur-sm border-0 p-0 cursor-pointer"
        onClick={handleClose}
        aria-label={t('certClose')}
        tabIndex={-1}
      />

      <div
        className="relative z-10 w-full max-w-[900px] flex flex-col items-stretch pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <h2 id="cert-modal-title" className="text-sm font-bold text-white sm:text-zinc-100">
            {t('certPreviewTitle')}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="bg-zinc-700 hover:bg-zinc-600 text-white p-2.5 rounded-xl cursor-pointer shrink-0"
            aria-label={t('certClose')}
          >
            <X size={20} />
          </button>
        </div>

        <CertificateActions
          results={results}
          user={user}
          lang={lang}
          showPreview={false}
          className="mb-4"
        />

        <div className="bg-white shadow-2xl rounded-md border border-slate-300 p-3 sm:p-4 mx-auto w-full">
          <CertificatePreviewScaler pageCount={pageCount}>
            <CertificateDocument
              ref={previewRef}
              results={results}
              user={user}
              copy={copy}
              previewStacked
              forPdfExport={previewMatchesPdf}
            />
          </CertificatePreviewScaler>
        </div>

        <p className="text-center text-xs qd-light-muted mt-3">
          {A4_LANDSCAPE.width}×{A4_LANDSCAPE.height}px · {t('certStandard', {
            duration: results.testDuration,
            lang: t(`lang_${results.testLang}`),
          })}
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
