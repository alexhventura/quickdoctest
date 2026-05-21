import { forwardRef, memo, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useI18n } from '@/contexts/I18nContext';
import { generateValidationUrl } from '@/utils/formatting/validationUrl';
import { getCertificateMetrics, getCertificateRankLabel } from '@/utils/certificate/certificateMetrics';
import {
  A4_LANDSCAPE,
  CERT_COLORS,
  CERT_CONTENT,
  CERT_FONT,
  CERT_SAFE,
  CERT_SPACE,
  CERT_TYPE,
  getCertificateNameSize,
} from '@/constants/certificateLayout';
import CertificateBackgroundSvg from './CertificateBackgroundSvg';

export { A4_LANDSCAPE };

const sectionStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flexShrink: 0,
};

function DividerLine() {
  return (
    <div
      style={{
        width: 240,
        height: 1,
        backgroundColor: CERT_COLORS.navyMuted,
      }}
    />
  );
}

function MetricsCard({ metrics }) {
  const cardWidth = 540;

  return (
    <div
      style={{
        width: cardWidth,
        maxWidth: '100%',
        borderRadius: 16,
        backgroundColor: CERT_COLORS.cardBg,
        border: `1px solid ${CERT_COLORS.cardBorder}`,
        boxShadow: '0 10px 30px rgba(30,58,95,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          padding: '22px 26px',
          backgroundColor: CERT_COLORS.heroBg,
          borderBottom: `1px solid ${CERT_COLORS.cardBorder}`,
        }}
      >
        {metrics.hero.map((m) => (
          <div key={m.key}>
            <div
              style={{
                fontSize: CERT_TYPE.metricHeroLabel.size,
                fontWeight: CERT_TYPE.metricHeroLabel.weight,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: CERT_COLORS.grayMid,
                marginBottom: 8,
              }}
            >
              {m.label}
            </div>

            <div
              style={{
                fontSize: CERT_TYPE.metricHeroValue.size,
                fontWeight: CERT_TYPE.metricHeroValue.weight,
                color: CERT_COLORS.navy,
                lineHeight: 1,
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '18px 14px',
          padding: '20px 26px',
        }}
      >
        {metrics.secondary.map((m) => (
          <div key={m.label}>
            <div
              style={{
                fontSize: CERT_TYPE.metricSecLabel.size,
                fontWeight: CERT_TYPE.metricSecLabel.weight,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: CERT_COLORS.grayLight,
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>

            <div
              style={{
                fontSize: CERT_TYPE.metricSecValue.size,
                fontWeight: CERT_TYPE.metricSecValue.weight,
                color: CERT_COLORS.grayDark,
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthFooter({ validationUrl, issuedOn, authLabel, siteLabel }) {
  return (
    <div
      style={{
        ...sectionStyle,
        width: 260,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: CERT_TYPE.footerBrand.size,
          fontWeight: CERT_TYPE.footerBrand.weight,
          color: CERT_COLORS.navy,
          letterSpacing: '0.02em',
          textTransform: 'none',
        }}
      >
        {siteLabel}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: CERT_TYPE.footerMeta.size,
          color: CERT_COLORS.grayMid,
        }}
      >
        {issuedOn}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 6,
        }}
      >
        <QRCodeSVG
          value={validationUrl}
          size={54}
          level="H"
          fgColor={CERT_COLORS.navy}
          bgColor="transparent"
        />
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: CERT_TYPE.footerAuth.size,
          fontWeight: CERT_TYPE.footerAuth.weight,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: CERT_COLORS.navy,
        }}
      >
        {authLabel}
      </div>
    </div>
  );
}

const CertificateDocument = forwardRef(function CertificateDocument(
  { results, user },
  ref,
) {
  const { t } = useI18n();

  const validationUrl = generateValidationUrl(results, user);

  const displayName = user?.name || t('certAnonymous');

  const rankLabel = getCertificateRankLabel(results, t);

  const nameSize = getCertificateNameSize(displayName);

  const metrics = useMemo(
    () =>
      getCertificateMetrics(results, {
        keystrokes: t('certLabelKeystrokes'),
        errors: t('certLabelErrors'),
        latency: t('certLabelLatency'),
        consistency: t('certLabelConsistency'),
        completion: t('certLabelCompletion'),
      }),
    [results, t],
  );

  return (
    <div
      ref={ref}
      id="certificado-container"
      className="qd-certificate-doc"
      style={{
        width: A4_LANDSCAPE.width,
        height: A4_LANDSCAPE.height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: CERT_FONT,
        backgroundColor: '#fff',
      }}
    >
      <CertificateBackgroundSvg />

      <div
        style={{
          position: 'absolute',
          top: CERT_SAFE.top,
          right: CERT_SAFE.right,
          bottom: CERT_SAFE.bottom,
          left: CERT_SAFE.left,

          display: 'flex',
          flexDirection: 'column',

          alignItems: 'center',

          justifyContent: 'center',

          gap: 18,

          textAlign: 'center',

          zIndex: 2,
        }}
      >
        <header
          style={{
            ...sectionStyle,
            maxWidth: 620,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: CERT_TYPE.brand.size,
              fontWeight: CERT_TYPE.brand.weight,
              color: CERT_COLORS.navy,
            }}
          >
            {t('certBrandTitle')}
          </h1>

          <p
            style={{
              marginTop: CERT_SPACE.titleToSubtitle,
              fontSize: CERT_TYPE.subtitle.size,
              color: CERT_COLORS.grayDark,
            }}
          >
            {t('certTitle')}
          </p>

          <p
            style={{
              marginTop: CERT_SPACE.subtitleToMeta,
              fontSize: CERT_TYPE.meta.size,
              color: CERT_COLORS.grayMid,
            }}
          >
            {t('certStandard', {
              duration: results.testDuration,
              lang: t(`lang_${results.testLang}`),
            })}
          </p>
        </header>

        <section
          style={{
            ...sectionStyle,
            maxWidth: 620,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: CERT_TYPE.certify.size,
              fontStyle: 'italic',
              color: CERT_COLORS.grayMid,
            }}
          >
            {t('certSubtitle')}
          </p>

          <h2
            style={{
              marginTop: CERT_SPACE.certifyToName,
              fontSize: nameSize,
              fontWeight: 700,
              color: CERT_COLORS.navy,
              lineHeight: 1.05,
            }}
          >
            {displayName}
          </h2>

          <p
            style={{
              marginTop: 10,
              fontSize: CERT_TYPE.level.size,
              fontWeight: CERT_TYPE.level.weight,
              color: CERT_COLORS.grayDark,
            }}
          >
            {t('certRankLine', { rank: rankLabel })}
          </p>

          <div style={{ marginTop: 18 }}>
            <DividerLine />
          </div>
        </section>

        <MetricsCard metrics={metrics} />

        <AuthFooter
          validationUrl={validationUrl}
          issuedOn={t('certIssuedOn', { date: results.timestamp })}
          authLabel={t('certAuth')}
          siteLabel={t('certSiteUrl')}
        />
      </div>
    </div>
  );
});

export default memo(CertificateDocument);