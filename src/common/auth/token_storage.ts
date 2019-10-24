const storage = window.localStorage || {};

let tokenCache = window.__tokenCache;
if (!tokenCache) {
  tokenCache = window.__tokenCache = {
    tokens: undefined
  };
}

export function askWrite() {
  return (
    tokenCache.tokens !== undefined
  );
}

export function saveTokens(tokens: String | null) {
  tokenCache.tokens = tokens;
  try {
    storage.Tokens = tokens;
  } catch (err) {
    // write failed, ignore it. Happens if storage is full or private mode.
  }
}

export function loadTokens() {
  if (tokenCache.tokens === undefined) {
    try {
      const tokens = storage.Tokens;
      if (tokens) {
        tokenCache.tokens = tokens;
      } else {
        tokenCache.tokens = null;
      }
    } catch (err) {
      tokenCache.tokens = null;
    }
  }
  return tokenCache.tokens;
}
