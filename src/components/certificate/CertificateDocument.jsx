import { forwardRef, memo } from 'react';
import qtLogo from '@/assets/QT_V2.png';
import { useI18n } from '@/contexts/I18nContext';
import { buildCertificateTemplateModel, CertificateTemplate, CERTIFICATE_SIZE } from './certificateTemplate';

export const A4_LANDSCAPE = CERTIFICATE_SIZE;

const CertificateDocument = forwardRef(function CertificateDocument({ results, user, copy }, ref) {
  const { t } = useI18n();
  const model = buildCertificateTemplateModel({ results, user, copy, t });

  return (
    <div ref={ref} id="certificado-container">
      <CertificateTemplate model={model} logoSrc={qtLogo} />
    </div>
  );
});

export default memo(CertificateDocument);