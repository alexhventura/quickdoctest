import { getCertificateMetricCards, getCertificateSerial } from '@/utils/certificate/certificateMetrics';

export const CERTIFICATE_SIZE = {
  width: 841,
  height: 595,
};

const PAGE_MARGIN = 36;
export const CERT_INNER_WIDTH = CERTIFICATE_SIZE.width - PAGE_MARGIN * 2;

const GRID_COLUMNS = 5;
const FIRST_PAGE_CARD_MAX = GRID_COLUMNS * 2;
const CONTINUATION_PAGE_CARD_MAX = GRID_COLUMNS * 3;

const boundedText = {
  maxWidth: '100%',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
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

function fontByLength(text, tiers, fallback) {
  const len = String(text || '').length;
  for (const tier of tiers) {
    if (len <= tier.maxLen) return tier.size;
  }
  return fallback;
}

export function buildCertificateTemplateModel({ results, user, copy, t }) {
  const safeCopy = copy || {};
  const rankLabel = safeCopy.rankLabel || '—';
  const rankText = safeCopy.rankLine || t('certRankLine', { rank: rankLabel });
  const standard =
    safeCopy.standard ||
    t('certStandard', {
      duration: results?.testDuration || 30,
      lang: t(`lang_${results?.testLang || 'en'}`),
    });

  const ts = results?.timestamp;
  const dateFormatted = ts ? formatDate(ts) : '—';
  const issuedLine = t('certIssuedOn', { date: dateFormatted });

  const name = user?.name || safeCopy.anonymous || t('certAnonymous');
  const email = user?.email || '';
  const serial = getCertificateSerial(results);

  const metricCards =
    safeCopy.metrics?.cards ||
    getCertificateMetricCards(results, {
      keystrokes: safeCopy.metrics?.labels?.keystrokes || t('certLabelKeystrokes'),
      errors: safeCopy.metrics?.labels?.errors || t('certLabelErrors'),
      latency: safeCopy.metrics?.labels?.latency || t('certLabelLatency'),
      consistency: safeCopy.metrics?.labels?.consistency || t('certLabelConsistency'),
      completion: safeCopy.metrics?.labels?.completion || t('certLabelCompletion'),
    });

  return {
    name,
    email,
    brandTitle: safeCopy.brandTitle || t('certBrandTitle'),
    title: safeCopy.title || t('certTitle'),
    standard,
    subtitle: safeCopy.subtitle || t('certSubtitle'),
    rankLine: rankText,
    siteUrl: safeCopy.siteUrl || t('certSiteUrl') || 'www.quickdoctest.com',
    issuedLine,
    serialLine: `Serial: ${serial}`,
    serial,
    metricCards,
    typeSizes: {
      name: fontByLength(name, [
        { maxLen: 22, size: 34 },
        { maxLen: 34, size: 28 },
        { maxLen: 48, size: 24 },
      ], 20),
      email: fontByLength(email, [{ maxLen: 36, size: 13 }, { maxLen: 52, size: 11 }], 10),
      standard: fontByLength(standard, [{ maxLen: 48, size: 12 }, { maxLen: 72, size: 10 }], 9),
    },
  };
}

/** Divide métricas em páginas quando não couberem na primeira folha */
export function paginateCertificatePages(model) {
  const all = model.metricCards || [];
  const totalPages =
    all.length <= FIRST_PAGE_CARD_MAX
      ? 1
      : 1 + Math.ceil((all.length - FIRST_PAGE_CARD_MAX) / CONTINUATION_PAGE_CARD_MAX);

  if (totalPages === 1) {
    return [
      {
        variant: 'full',
        cards: all,
        showFooter: true,
        pageNumber: 1,
        totalPages: 1,
      },
    ];
  }

  const pages = [
    {
      variant: 'full',
      cards: all.slice(0, FIRST_PAGE_CARD_MAX),
      showFooter: false,
      pageNumber: 1,
      totalPages,
    },
  ];

  let offset = FIRST_PAGE_CARD_MAX;
  let pageNum = 2;
  while (offset < all.length) {
    const chunk = all.slice(offset, offset + CONTINUATION_PAGE_CARD_MAX);
    offset += CONTINUATION_PAGE_CARD_MAX;
    pages.push({
      variant: 'continuation',
      cards: chunk,
      showFooter: offset >= all.length,
      pageNumber: pageNum,
      totalPages,
    });
    pageNum += 1;
  }

  return pages;
}

function MetricCard({ value, label }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.96)',
        borderRadius: 14,
        border: '1px solid rgba(148,163,184,0.35)',
        boxShadow: '0 4px 16px rgba(15,23,42,0.07)',
        padding: '10px 8px',
        minWidth: 0,
        boxSizing: 'border-box',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.05,
          ...boundedText,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 5,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#64748b',
          lineHeight: 1.2,
          ...boundedText,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CertificatePageFrame({ children }) {
  return (
    <div
      style={{
        width: CERTIFICATE_SIZE.width,
        height: CERTIFICATE_SIZE.height,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'linear-gradient(145deg, #1e3a5f 0%, #2a5080 50%, #3d6a9e 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 12,
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.35)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: PAGE_MARGIN,
          borderRadius: 10,
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(15,23,42,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FullHeader({ model, logoSrc }) {
  const { typeSizes: ts } = model;
  return (
    <header style={{ textAlign: 'center', flexShrink: 0, paddingTop: 4 }}>
      <img
        src={logoSrc}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          left: 12,
          top: 10,
          width: 52,
          height: 52,
          objectFit: 'contain',
        }}
      />
      <h1
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          ...boundedText,
        }}
      >
        {model.brandTitle}
      </h1>
      <p
        style={{
          margin: '6px 0 0',
          fontSize: 17,
          fontWeight: 700,
          color: '#1e293b',
          lineHeight: 1.15,
          ...boundedText,
        }}
      >
        {model.title}
      </p>
      <p
        style={{
          margin: '6px 0 0',
          fontSize: ts.standard,
          fontWeight: 600,
          color: '#475569',
          lineHeight: 1.25,
          ...boundedText,
        }}
      >
        {model.standard}
      </p>
      <p
        style={{
          margin: '18px 0 0',
          fontSize: 14,
          fontWeight: 600,
          fontStyle: 'italic',
          color: '#334155',
          ...boundedText,
        }}
      >
        {model.subtitle}
      </p>
      <h2
        style={{
          margin: '10px 0 0',
          fontSize: ts.name,
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.08,
          ...boundedText,
        }}
      >
        {model.name}
      </h2>
      {model.email ? (
        <p
          style={{
            margin: '4px 0 0',
            fontSize: ts.email,
            fontWeight: 500,
            color: '#64748b',
            lineHeight: 1.2,
            ...boundedText,
          }}
        >
          {model.email}
        </p>
      ) : null}
      <p
        style={{
          margin: '10px 0 0',
          fontSize: 14,
          fontWeight: 700,
          color: '#2563eb',
          lineHeight: 1.2,
          ...boundedText,
        }}
      >
        {model.rankLine}
      </p>
    </header>
  );
}

function ContinuationHeader({ model }) {
  const line = [model.brandTitle, model.title, model.name].filter(Boolean).join(' · ');
  return (
    <header
      style={{
        flexShrink: 0,
        paddingBottom: 12,
        borderBottom: '1px solid #e2e8f0',
        marginBottom: 14,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 1.3,
          ...boundedText,
        }}
      >
        {line}
      </p>
    </header>
  );
}

function PageFooter({ model }) {
  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: 14,
        flexShrink: 0,
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <p
        style={{
          margin: 0,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#334155',
          letterSpacing: '0.06em',
          ...boundedText,
        }}
      >
        {model.siteUrl}
      </p>
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
          minWidth: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 600,
            color: '#64748b',
            flex: '1 1 auto',
            minWidth: 0,
            lineHeight: 1.3,
            ...boundedText,
          }}
        >
          {model.issuedLine}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 9,
            fontWeight: 500,
            color: '#94a3b8',
            fontFamily: 'monospace',
            flex: '0 1 auto',
            textAlign: 'right',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
          }}
        >
          {model.serialLine}
        </p>
      </div>
    </footer>
  );
}

function CertificatePage({ model, page, logoSrc }) {
  const gridWidth = Math.min(CERT_INNER_WIDTH - 48, 720);

  return (
    <div
      className="certificate-page"
      data-page={page.pageNumber}
      data-total-pages={page.totalPages}
      style={{ flexShrink: 0 }}
    >
      <CertificatePageFrame>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px 18px',
            minHeight: 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {page.variant === 'full' ? (
            <FullHeader model={model} logoSrc={logoSrc} />
          ) : (
            <ContinuationHeader model={model} />
          )}

          <div
            style={{
              marginTop: page.variant === 'full' ? 16 : 0,
              width: gridWidth,
              maxWidth: '100%',
              alignSelf: 'center',
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
              gap: 10,
              flexShrink: 0,
              boxSizing: 'border-box',
            }}
          >
            {page.cards.map((card) => (
              <MetricCard key={card.key} value={card.value} label={card.label} />
            ))}
          </div>

          {page.showFooter ? <PageFooter model={model} /> : null}
        </div>
      </CertificatePageFrame>
    </div>
  );
}

export function CertificateTemplate({ model, logoSrc }) {
  const pages = paginateCertificatePages(model);

  return (
    <>
      {pages.map((page) => (
        <CertificatePage key={page.pageNumber} model={model} page={page} logoSrc={logoSrc} />
      ))}
    </>
  );
}
