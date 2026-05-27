import { forwardRef, memo } from 'react';
import qtLogo from '@/assets/QT_V2.png';
import { useI18n } from '@/contexts/I18nContext';
import {
  buildCertificateTemplateModel,
  CertificateTemplate,
  CERTIFICATE_SIZE,
  paginateCertificatePages,
} from './certificateTemplate';

export const A4_LANDSCAPE = CERTIFICATE_SIZE;

const CertificateDocument = forwardRef(function CertificateDocument(
  { results, user, copy, previewStacked = true },
  ref,
) {
  const { t } = useI18n();
  const model = buildCertificateTemplateModel({ results, user, copy, t });
  const pageCount = paginateCertificatePages(model).length;

  return (
    <div
      ref={ref}
      id="certificado-container"
      style={{
        width: CERTIFICATE_SIZE.width,
        display: 'flex',
        flexDirection: 'column',
        gap: previewStacked && pageCount > 1 ? 20 : 0,
        flexShrink: 0,
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      }}
    >
      <CertificateTemplate model={model} logoSrc={qtLogo} />
    </div>
  );
});

export default memo(CertificateDocument);
