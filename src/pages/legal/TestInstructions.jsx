import { useI18n } from '@/contexts/I18nContext';
import { getLegalUpdatedDate, SITE_SEO_DESCRIPTION } from '@/constants/legal';
import { getInstructionsContent } from '@/i18n/legal';
import LegalPageLayout from '@/components/legal/LegalPageLayout';

export default function TestInstructions() {
  const { lang } = useI18n();
  const content = getInstructionsContent(lang);

  return (
    <LegalPageLayout
      title={content.title}
      subtitle={content.subtitle}
      metaTitle={content.metaTitle}
      metaDescription={SITE_SEO_DESCRIPTION}
    >
      {content.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>{content.metricsHeading}</h2>

      {content.metrics.map((m) => (
        <div key={m.title} className="qd-legal-metric-card">
          <h3>{m.title}</h3>
          <p style={{ margin: 0 }}>{m.body}</p>
        </div>
      ))}

      <h2>{content.levelsHeading}</h2>

      <div className="qd-legal-table-wrap">
        <table className="qd-legal-table">
          <thead>
            <tr>
              <th scope="col">{content.tableLevel}</th>
              <th scope="col">{content.tableDescription}</th>
            </tr>
          </thead>
          <tbody>
            {content.levels.map((row) => (
              <tr key={row.level}>
                <td>
                  <strong>{row.level}</strong>
                </td>
                <td>{row.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="qd-legal-note">{content.note}</p>
    </LegalPageLayout>
  );
}
