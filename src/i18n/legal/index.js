import * as pt from './pt';
import * as en from './en';
import * as es from './es';

const bundles = { pt, en, es };

export function getTermsContent(lang) {
  return bundles[lang]?.terms ?? bundles.en.terms;
}

export function getPrivacyContent(lang) {
  return bundles[lang]?.privacy ?? bundles.en.privacy;
}

export function getInstructionsContent(lang) {
  return bundles[lang]?.instructions ?? bundles.en.instructions;
}
