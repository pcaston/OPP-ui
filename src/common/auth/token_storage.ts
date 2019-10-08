const storage = window.localStorage || {};

declare global {
  interface Window {
    __tokenCache: {
      // undefined: we haven't loaded yet
      // null: none stored
      tokens?: String | null;
    };
  }
}

// So that core.js and main app hit same shared object.
let tokenCache = window.__tokenCache;
if (!tokenCache) {
  tokenCache = window.__tokenCache = {
    tokens: undefined,
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
  // Delete once oppTokens has been removed
  debugger;
  if (storage.oppTokens) {
    storage.Tokens = storage.oppTokens;
    tokenCache.tokens = storage.oppTokens;
    delete storage.oppTokens;
  }
  else {
    storage.Tokens = "uioyoiuyiuy";
    tokenCache.tokens = storage.Tokens;
  }
  if (tokenCache.tokens === undefined) {
    try {
      const tokens = storage.Tokens;
      if (tokens) {
        tokenCache.tokens = JSON.parse(tokens);
      } else {
        tokenCache.tokens = null;
      }
    } catch (err) {
      tokenCache.tokens = null;
    }
  }
  return tokenCache.tokens;
}
