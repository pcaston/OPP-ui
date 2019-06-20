import { translationMetadata } from "../resources/translations-metadata";

/**
 * Get browser specific 'en'
 */

// Store loaded translations in memory so translations are available immediately
// when DOM is created in Polymer. Even a cache lookup creates noticeable latency.
const translations = {};

async function fetchTranslation(fingerprint) {
  const response = await fetch(`/static/translations/${fingerprint}`, {
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error(
      `Fail to fetch translation ${fingerprint}: HTTP response status is ${
        response.status
      }`
    );
  }
  return response.json();
}



// Load selected translation into memory immediately so it is ready when Polymer
// initializes.
getTranslation(null, 'en');
