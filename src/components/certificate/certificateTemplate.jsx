import { getCertificateSerial } from '@/utils/certificate/certificateMetrics';

export const CERTIFICATE_SIZE = {
  width: 841,
  height: 595,
};

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function buildCertificateTemplateModel({ results, user, copy, t }) {
  const safeCopy = copy || {};
  const rankText = safeCopy.rankLine || t('certRankLine', { rank: safeCopy.rankLabel || '—' });
  const issuedText = safeCopy.issuedOn || t('certIssuedOn', { date: results?.timestamp || '—' });
  const durationText =
    safeCopy.durationLabel || `${t('testDurationLabel')} · ${results?.testDuration || 30}s`;

  return {
    name: user?.name || safeCopy.anonymous || t('certAnonymous'),
    brandTitle: safeCopy.brandTitle || t('certBrandTitle'),
    title: safeCopy.title || t('certTitle'),
    standard:
      safeCopy.standard ||
      t('certStandard', {
        duration: results?.testDuration || 30,
        lang: t(`lang_${results?.testLang || 'en'}`),
      }),
    subtitle: safeCopy.subtitle || t('certSubtitle'),
    rankLine: rankText,
    siteUrl: (safeCopy.siteUrl || t('certSiteUrl') || 'quickdoctest.com').toUpperCase(),
    issuedLabel: issuedText.replace(/^.*?:\s*/, ''),
    durationLabel: durationText.replace(/^.*·\s*/, ''),
    validationHint:
      safeCopy.validationHint || 'Store this serial with your test ID to verify in the future.',
    serial: getCertificateSerial(results),
    metrics: safeCopy.metrics || {
      hero: [
        { key: 'net', label: 'NET WPM', value: String(results?.netWpm ?? 0) },
        { key: 'acc', label: 'ACCURACY', value: `${results?.accuracy ?? 0}%` },
        { key: 'cpm', label: 'CPM', value: String(results?.cpm ?? 0) },
      ],
      secondary: [],
    },
  };
}

export function CertificateTemplate({ model, logoSrc }) {
  return (
    <div
      style={{
        width: CERTIFICATE_SIZE.width,
        height: CERTIFICATE_SIZE.height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'linear-gradient(135deg, #0f2f5e 0%, #173b70 45%, #31598b 100%)',
      }}
    >
      <svg
        width={CERTIFICATE_SIZE.width}
        height={CERTIFICATE_SIZE.height}
        viewBox={`0 0 ${CERTIFICATE_SIZE.width} ${CERTIFICATE_SIZE.height}`}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden
      >
        <defs>
          <radialGradient id="orbLeft" cx="0.04" cy="0.92" r="0.35">
            <stop offset="0" stopColor="#9ed3f0" stopOpacity="0.85" />
            <stop offset="1" stopColor="#9ed3f0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbRight" cx="0.88" cy="0.5" r="0.38">
            <stop offset="0" stopColor="#79b6df" stopOpacity="0.65" />
            <stop offset="1" stopColor="#79b6df" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={CERTIFICATE_SIZE.width} height={CERTIFICATE_SIZE.height} fill="rgba(12,35,70,0.66)" />
        <circle cx="40" cy="550" r="175" fill="url(#orbLeft)" />
        <circle cx="760" cy="305" r="225" fill="url(#orbRight)" />

        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={`ring-top-${i}`}
            cx="226"
            cy="-12"
            r={62 + i * 12}
            fill="none"
            stroke="rgba(255,255,255,0.62)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={`ring-bottom-${i}`}
            cx="196"
            cy="595"
            r={56 + i * 12}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={`ring-right-${i}`}
            cx="760"
            cy="300"
            r={120 + i * 40}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 14,
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: 'inset 0 0 0 2px rgba(11,28,58,0.65)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 28,
          border: '1px dashed rgba(255,255,255,0.2)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 42,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <img
          src={logoSrc}
          alt="QuickDocTest"
          style={{
            position: 'absolute',
            left: 8,
            top: 6,
            width: 92,
            height: 92,
            objectFit: 'contain',
          }}
        />

        <h1 style={{ margin: 0, marginTop: 8, fontSize: 56, fontWeight: 800 }}>{model.brandTitle}</h1>
        <p style={{ margin: '10px 0 0', fontSize: 33, fontWeight: 800 }}>{model.title}</p>
        <p style={{ margin: '10px 0 0', fontSize: 20, fontWeight: 800 }}>{model.standard}</p>
        <p style={{ margin: '30px 0 0', fontSize: 38, fontWeight: 800, fontStyle: 'italic' }}>{model.subtitle}</p>
        <h2 style={{ margin: '18px 0 0', fontSize: 66, fontWeight: 800, lineHeight: 1.06 }}>{model.name}</h2>
        <p style={{ margin: '16px 0 0', fontSize: 44, fontWeight: 800 }}>{model.rankLine}</p>

        <div
          style={{
            width: 540,
            maxWidth: '100%',
            height: 2,
            marginTop: 28,
            background: 'rgba(255,255,255,0.88)',
          }}
        />

        <div
          style={{
            marginTop: 24,
            width: 560,
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {model.metrics.hero.map((metric) => (
            <div
              key={metric.key}
              style={{
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.45)',
                background: 'linear-gradient(135deg, rgba(13,27,53,0.78), rgba(19,35,66,0.48))',
                padding: '14px 10px',
              }}
            >
              <div style={{ fontSize: 16, letterSpacing: '0.16em', fontWeight: 800 }}>{metric.label}</div>
              <div style={{ marginTop: 8, fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{metric.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            width: 560,
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          <div
            style={{
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(15,34,64,0.45)',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em' }}>DATE</div>
            <div style={{ marginTop: 5, fontSize: 19, fontWeight: 800 }}>{formatDate(model.issuedLabel)}</div>
          </div>
          <div
            style={{
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(15,34,64,0.45)',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em' }}>DURATION</div>
            <div style={{ marginTop: 5, fontSize: 19, fontWeight: 800 }}>{model.durationLabel}</div>
          </div>
          <div
            style={{
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(15,34,64,0.45)',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em' }}>VALIDATION</div>
            <div style={{ marginTop: 5, fontSize: 15, fontWeight: 800 }}>{model.validationHint}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            marginBottom: 12,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.14em',
            opacity: 0.98,
          }}
        >
          {model.siteUrl}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 8,
            bottom: 10,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.12em',
            opacity: 0.88,
            fontFamily: 'monospace',
          }}
        >
          {model.serial}
        </div>
      </div>
    </div>
  );
}

