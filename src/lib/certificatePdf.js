import { jsPDF } from 'jspdf';
import { getCertificateMetrics, getCertificateSerial } from '@/utils/certificate/certificateMetrics';
import {
  A4_LANDSCAPE,
  CERT_CARD_MM,
  CERT_COLORS,
  CERT_LAYOUT_MM,
  CERT_MARGIN_MM,
  PAGE_MM,
  getCertificateNameSize,
} from '@/constants/certificateLayout';
import { renderCertificateBackgroundToDataUrl } from '@/components/certificate/CertificateBackgroundSvg';

const M = CERT_MARGIN_MM;

function rgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function setText(pdf, hex) {
  const { r, g, b } = rgb(hex);
  pdf.setTextColor(r, g, b);
}

function contentY(offsetMm) {
  return M + offsetMm;
}

function nameFontPt(name) {
  return Math.round(getCertificateNameSize(name) * 0.28);
}

function fillGlassRect(pdf, x, y, w, h, radius = 2.5) {
  if (typeof pdf.GState === 'function') {
    pdf.saveGraphicsState();
    pdf.setGState(new pdf.GState({ opacity: 0.9 }));
  }
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.12);
  pdf.roundedRect(x, y, w, h, radius, radius, 'FD');
  if (typeof pdf.GState === 'function') {
    pdf.restoreGraphicsState();
  }
}

export async function buildCertificatePdf({ user, results, copy }) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const name = user?.name || copy.anonymous;
  const metrics = copy.metrics || getCertificateMetrics(results, {});
  const serial = getCertificateSerial(results);
  const cx = PAGE_MM.w / 2;
  const contentW = PAGE_MM.w - 2 * M;
  const L = CERT_LAYOUT_MM;

  try {
    const bg = await renderCertificateBackgroundToDataUrl(
      A4_LANDSCAPE.width,
      A4_LANDSCAPE.height,
    );
    pdf.addImage(bg, 'PNG', 0, 0, PAGE_MM.w, PAGE_MM.h);
  } catch {
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, PAGE_MM.w, PAGE_MM.h, 'F');
  }

  pdf.setFont('helvetica', 'bold');
  setText(pdf, CERT_COLORS.navy);
  pdf.setFontSize(22);
  pdf.text(copy.brandTitle, cx, contentY(L.brand + 6), { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  setText(pdf, CERT_COLORS.grayDark);
  pdf.setFontSize(11);
  pdf.text(copy.title, cx, contentY(L.subtitle + 5), { align: 'center' });

  setText(pdf, CERT_COLORS.grayMid);
  pdf.setFontSize(7.5);
  pdf.text(pdf.splitTextToSize(copy.standard, contentW - 8), cx, contentY(L.meta + 4), {
    align: 'center',
  });

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.text(copy.subtitle, cx, contentY(L.certify + 5), { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  setText(pdf, CERT_COLORS.navy);
  pdf.setFontSize(nameFontPt(name));
  const nameLines = pdf.splitTextToSize(name, contentW - 12);
  pdf.text(nameLines, cx, contentY(L.name + 8), { align: 'center' });

  if (user?.email) {
    pdf.setFont('helvetica', 'normal');
    setText(pdf, CERT_COLORS.grayMid);
    pdf.setFontSize(7);
    pdf.text(pdf.splitTextToSize(user.email, contentW - 12), cx, contentY(L.email + 4), {
      align: 'center',
    });
  }

  pdf.setFont('helvetica', 'normal');
  setText(pdf, CERT_COLORS.grayDark);
  pdf.setFontSize(11);
  const rankY = user?.email ? L.level : L.name + 14;
  pdf.text(copy.rankLine, cx, contentY(rankY + 5), { align: 'center' });

  pdf.setDrawColor(148, 163, 184);
  pdf.setLineWidth(0.25);
  const lineW = 60;
  const lineY = contentY(L.divider);
  pdf.line(cx - lineW / 2, lineY, cx + lineW / 2, lineY);

  const cardW = Math.min(CERT_CARD_MM.width, contentW * CERT_CARD_MM.maxWidthRatio);
  const cardX = cx - cardW / 2;
  const cardY = contentY(L.cardTop);
  const cardH = L.cardHeight;

  fillGlassRect(pdf, cardX, cardY, cardW, cardH);

  if (typeof pdf.GState === 'function') {
    pdf.saveGraphicsState();
    pdf.setGState(new pdf.GState({ opacity: 0.9 }));
  }
  pdf.setFillColor(241, 245, 249);
  pdf.rect(cardX + 0.5, cardY + 0.5, cardW - 1, 18, 'F');
  if (typeof pdf.GState === 'function') {
    pdf.restoreGraphicsState();
  }

  const colW = cardW / 3;
  metrics.hero.forEach((metric, i) => {
    const x = cardX + colW * i + colW / 2;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5.5);
    setText(pdf, CERT_COLORS.grayMid);
    pdf.text(metric.label, x, cardY + 7, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    setText(pdf, CERT_COLORS.navy);
    pdf.text(metric.value, x, cardY + 15, { align: 'center' });
  });

  pdf.setDrawColor(226, 232, 240);
  pdf.line(cardX + 5, cardY + 20, cardX + cardW - 5, cardY + 20);

  const secCols = 3;
  const secCellW = cardW / secCols;
  metrics.secondary.forEach((metric, i) => {
    const col = i % secCols;
    const row = Math.floor(i / secCols);
    const x = cardX + secCellW * col + secCellW / 2;
    const cy = cardY + 26 + row * 9;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5);
    setText(pdf, CERT_COLORS.grayLight);
    pdf.text(metric.label, x, cy, { align: 'center' });
    pdf.setFontSize(8);
    setText(pdf, CERT_COLORS.grayDark);
    pdf.text(metric.value, x, cy + 4.5, { align: 'center' });
  });

  const footerW = Math.min(cardW + 20, contentW);
  const footerX = cx - footerW / 2;
  const footerY = contentY(L.footerBrand - 2);
  const footerH = contentY(L.footerAuth + 8) - footerY;

  fillGlassRect(pdf, footerX, footerY, footerW, footerH, 2);

  pdf.setFont('helvetica', 'bold');
  setText(pdf, CERT_COLORS.navy);
  pdf.setFontSize(7.5);
  pdf.text(copy.siteUrl || 'www.quickdoctest.com', cx, contentY(L.footerBrand + 4), {
    align: 'center',
  });

  pdf.setFont('helvetica', 'normal');
  setText(pdf, CERT_COLORS.grayMid);
  pdf.setFontSize(6.5);
  pdf.text(copy.issuedOn, cx, contentY(L.footerIssued + 4), { align: 'center' });

  // Cartão de serial e validação minimalista
  const serialCardW = Math.min(70, contentW * 0.5);
  const serialCardX = cx - serialCardW / 2;
  const serialCardY = contentY(L.footerAuth);
  const serialCardH = 12;

  fillGlassRect(pdf, serialCardX, serialCardY, serialCardW, serialCardH, 1.8);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5.3);
  setText(pdf, CERT_COLORS.grayMid);
  pdf.text(`Serial`, serialCardX + 3, serialCardY + 4.6);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, CERT_COLORS.navy);
  pdf.text(serial, serialCardX + serialCardW - 2, serialCardY + 7.5, {
    align: 'right',
  });

  return pdf;
}

export function getCertificateFileName(user, results) {
  const slug = user?.name?.replace(/\s+/g, '_') || 'Participante';
  return `Certificado_QUICKDOC_${slug}_${results?.testDuration || 30}s.pdf`;
}

export async function downloadCertificatePdfFile({ user, results, copy }) {
  const pdf = await buildCertificatePdf({ user, results, copy });
  pdf.save(getCertificateFileName(user, results));
  return { ok: true };
}

export async function getCertificatePdfBlob({ user, results, copy }) {
  return (await buildCertificatePdf({ user, results, copy })).output('blob');
}
