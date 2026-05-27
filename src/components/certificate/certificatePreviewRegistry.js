let previewEntry = null;

/**
 * Registra o nó do certificado exibido na prévia (modal).
 * O PDF usa esse DOM quando disponível para garantir export idêntico à tela.
 */
export function setCertificatePreview(node, meta = null) {
  previewEntry = node ? { node, meta } : null;
}

export function getCertificatePreview(meta = null) {
  if (!previewEntry?.node?.isConnected) {
    previewEntry = null;
    return null;
  }
  if (meta && previewEntry.meta) {
    const sameResult = previewEntry.meta.timestamp === meta.timestamp;
    const sameUser = previewEntry.meta.userEmail === meta.userEmail;
    if (!sameResult || !sameUser) return null;
  }
  return previewEntry.node;
}
