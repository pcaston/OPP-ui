import { translationMetadata } from "../resources/translations-metadata";

/**
 * Get browser specific language
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

export async function getTranslation(
  fragment: string | null,
  language: string
) {
  const metadata = translationMetadata.translations[language];
  const fingerprint =
    metadata.fingerprints[fragment ? `${fragment}/${language}` : language];

  // Fetch translation from the server
  if (!translations[fingerprint]) {
    translations[fingerprint] = fetchTranslation(fingerprint)
      .then((data) => ({ language, data }))
      .catch((error) => {
        delete translations[fingerprint];
        if (language !== "en") {
          // Couldn't load selected translation. Try a fall back to en before failing.
          return getTranslation(fragment, "en");
        }
        return Promise.reject(error);
      });
  }
  return translations[fingerprint];
}

// Load selected translation into memory immediately so it is ready when Polymer
// initializes.
getTranslation(null, 'en');
