const UNSUPPORTED_COLOR_FN = /\b(lab|oklab|color-mix|oklch|lch|hwb)\(/i;

const COLOR_PROPERTIES = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'fill',
  'stroke',
];

let colorNormalizeCanvas = null;

function getColorNormalizeContext() {
  if (typeof document === 'undefined') return null;
  if (!colorNormalizeCanvas) {
    colorNormalizeCanvas = document.createElement('canvas');
    colorNormalizeCanvas.width = 1;
    colorNormalizeCanvas.height = 1;
  }
  return colorNormalizeCanvas.getContext('2d');
}

/** Converte qualquer cor suportada pelo navegador para HEX/RGB via canvas. */
export function normalizeCssColor(value, fallback = '#000000') {
  if (!value || value === 'transparent' || value === 'none' || value === 'initial' || value === 'inherit') {
    return value;
  }

  const trimmed = String(value).trim();
  if (!UNSUPPORTED_COLOR_FN.test(trimmed)) {
    return trimmed;
  }

  const ctx = getColorNormalizeContext();
  if (!ctx) return fallback;

  try {
    ctx.fillStyle = '#000000';
    ctx.fillStyle = trimmed;
    return ctx.fillStyle || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Remove folhas de estilo globais (Tailwind/lab) do clone e força cores seguras.
 * Evita erro html2canvas: "unsupported color function 'lab'".
 */
export function sanitizeCloneForPdfExport(clonedDoc, rootId = 'qd-pdf-capture-host') {
  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    if (node.getAttribute('data-qdf-keep') !== 'true') {
      node.remove();
    }
  });

  const root = clonedDoc.getElementById(rootId);
  if (!root) return;

  const view = clonedDoc.defaultView;
  if (!view) return;

  const nodes = [root, ...root.querySelectorAll('*')];
  nodes.forEach((el) => {
    el.removeAttribute('class');

    COLOR_PROPERTIES.forEach((prop) => {
      const computed = view.getComputedStyle(el).getPropertyValue(prop);
      const inline = el.style.getPropertyValue(prop);
      const raw = inline || computed;
      if (!raw) return;

      const safe = normalizeCssColor(raw);
      if (safe && safe !== raw) {
        el.style.setProperty(prop, safe, 'important');
      }
    });

    const boxShadow = el.style.boxShadow || view.getComputedStyle(el).boxShadow;
    if (boxShadow && UNSUPPORTED_COLOR_FN.test(boxShadow)) {
      el.style.setProperty('box-shadow', 'none', 'important');
    }
  });
}
