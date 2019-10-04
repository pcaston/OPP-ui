import { AuthData } from "../../open-peer-power-js-websocket/lib";

const storage = window.localStorage || {};

declare global {
  interface Window {
    __tokenCache: {
      // undefined: we haven't loaded yet
      // null: none stored
      tokens?: AuthData | null;
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

export function saveTokens(tokens: AuthData | null) {
  tokenCache.tokens = tokens;
  try {
    storage.oppTokens = JSON.stringify(tokens);
  } catch (err) {
    // write failed, ignore it. Happens if storage is full or private mode.
  }
}

export function loadTokens() {
  
  if (tokenCache.tokens === undefined) {
    try {
      // Delete the old token cache.
      delete storage.tokens;
      const tokens = storage.oppTokens;
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
