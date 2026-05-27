import { forwardRef, memo, useMemo } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { getCertificateMetrics, getCertificateRankLabel, getCertificateSerial } from '@/utils/certificate/certificateMetrics';
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

function InfoCards({ issuedOn, durationLabel, serial, validationHint }) {
  const cardBase = {
    borderRadius: 12,
    padding: '10px 14px',
    border: '1px solid rgba(148,163,184,0.45)',
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.4))',
    boxShadow: '0 12px 30px rgba(15,23,42,0.35)',
    backdropFilter: 'blur(12px)',
    minWidth: 150,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
      }}
    >
      <div style={cardBase}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: CERT_COLORS.white,
            opacity: 0.8,
          }}
        >
          Date
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: 600,
            color: CERT_COLORS.white,
          }}
        >
          {issuedOn}
        </div>
      </div>

      <div style={cardBase}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: CERT_COLORS.white,
            opacity: 0.8,
          }}
        >
          Duration
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: 600,
            color: CERT_COLORS.white,
          }}
        >
          {durationLabel}
        </div>
      </div>

      <div style={cardBase}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: CERT_COLORS.white,
            opacity: 0.8,
          }}
        >
          Serial
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'monospace',
            color: CERT_COLORS.white,
          }}
        >
          {serial}
        </div>
      </div>

      <div style={cardBase}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: CERT_COLORS.white,
            opacity: 0.8,
          }}
        >
          Validation
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            fontWeight: 500,
            color: CERT_COLORS.white,
            opacity: 0.9,
          }}
        >
          {validationHint}
        </div>
      </div>
    </div>
  );
}

const CertificateDocument = forwardRef(function CertificateDocument(
  { results, user },
  ref,
) {
  const { t } = useI18n();

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

  const serial = getCertificateSerial(results);
  const issuedOn = t('certIssuedOn', { date: results.timestamp });
  const durationLabel = t('testDurationLabel') + ` · ${results.testDuration || 30}s`;
  const validationHint = 'Store this serial with your test ID to verify in the future.';

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
              color: CERT_COLORS.white,
            }}
          >
            {t('certBrandTitle')}
          </h1>

          <p
            style={{
              marginTop: CERT_SPACE.titleToSubtitle,
              fontSize: CERT_TYPE.subtitle.size,
              color: CERT_COLORS.white,
            }}
          >
            {t('certTitle')}
          </p>

          <p
            style={{
              marginTop: CERT_SPACE.subtitleToMeta,
              fontSize: CERT_TYPE.meta.size,
              color: CERT_COLORS.white,
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
              color: CERT_COLORS.white,
            }}
          >
            {t('certSubtitle')}
          </p>

          <h2
            style={{
              marginTop: CERT_SPACE.certifyToName,
              fontSize: nameSize,
              fontWeight: 700,
              color: CERT_COLORS.white,
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
              color: CERT_COLORS.white,
            }}
          >
            {t('certRankLine', { rank: rankLabel })}
          </p>

          <div style={{ marginTop: 18 }}>
            <DividerLine />
          </div>
        </section>

        <MetricsCard metrics={metrics} />

        <InfoCards
          issuedOn={issuedOn}
          durationLabel={durationLabel}
          serial={serial}
          validationHint={validationHint}
        />

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: CERT_COLORS.white,
            opacity: 0.8,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {t('certSiteUrl')}
        </div>
      </div>
    </div>
  );
});

export default memo(CertificateDocument);