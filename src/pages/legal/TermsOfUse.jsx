import { useI18n } from '@/contexts/I18nContext';
import { getLegalUpdatedDate, SITE_SEO_DESCRIPTION } from '@/constants/legal';
import { getTermsContent } from '@/i18n/legal';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSections from '@/components/legal/LegalSections';

export default function TermsOfUse() {
  const { lang } = useI18n();
  const content = getTermsContent(lang);

  return (
    <LegalPageLayout
      title={content.title}
      metaTitle={content.metaTitle}
      metaDescription={SITE_SEO_DESCRIPTION}
    >
      <p className="qd-legal-updated">
        {content.updatedLabel} {getLegalUpdatedDate(lang)}
      </p>

      {content.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <LegalSections sections={content.sections} />
    </LegalPageLayout>
  );
}
