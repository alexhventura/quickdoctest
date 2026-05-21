import { useI18n } from '@/contexts/I18nContext';
import { getLegalUpdatedDate, SITE_SEO_DESCRIPTION } from '@/constants/legal';
import { getPrivacyContent } from '@/i18n/legal';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSections from '@/components/legal/LegalSections';

export default function PrivacyPolicy() {
  const { lang } = useI18n();
  const content = getPrivacyContent(lang);

  return (
    <LegalPageLayout
      title={content.title}
      metaTitle={content.metaTitle}
      metaDescription={SITE_SEO_DESCRIPTION}
    >
      <p className="qd-legal-updated">
        {content.updatedLabel} {getLegalUpdatedDate(lang)}
      </p>
      <p>{content.intro}</p>
      <LegalSections sections={content.sections} />
    </LegalPageLayout>
  );
}
