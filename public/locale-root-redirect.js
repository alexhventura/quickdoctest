/**
 * Redirecionamento síncrono na raiz (antes do bundle React).
 * Lógica espelhada em src/utils/locale/detectBrowserLanguage.js
 */
(function localeRootRedirect() {
  var STORAGE_KEY = 'qd_lang';
  var LOCALES = ['pt', 'en', 'es'];

  function languageFromTag(tag) {
    var lower = (tag || 'en').toLowerCase();
    if (lower.indexOf('pt') === 0) return 'pt';
    if (lower.indexOf('es') === 0) return 'es';
    return 'en';
  }

  function detectBrowserLanguage() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (LOCALES.indexOf(stored) !== -1) return stored;
    } catch (e) {
      /* ignore */
    }
    var tag =
      (navigator.language ||
        (navigator.languages && navigator.languages[0]) ||
        'en');
    return languageFromTag(tag);
  }

  var host = location.hostname;
  if (host === 'quickdoctest.com') {
    location.replace(
      'https://www.quickdoctest.com' +
        location.pathname +
        location.search +
        location.hash,
    );
    return;
  }

  var path = location.pathname;
  if (path !== '/' && path !== '') return;

  var lang = detectBrowserLanguage();
  var target = '/' + lang + location.search + location.hash;
  if (location.pathname !== '/' + lang) {
    location.replace(target);
  }
})();
