import { AuthData } from "../../open-peer-power-js-websocket/lib";

const storage = window.localStorage || {};
declare global {
  interface Window {
    __tokenCache: {
      // undefined: we haven't loaded yet
      // null: none stored
      tokens?: AuthData | null;
      writeEnabled?: boolean;
    };
  }
}

let tokenCache = window.__tokenCache;
if (!tokenCache) {
  tokenCache = window.__tokenCache = {
    tokens: undefined,
    writeEnabled: undefined,
  };
}

export function askWrite() {
  return (
    tokenCache.tokens !== undefined && tokenCache.writeEnabled === undefined
  );
}

export function saveTokens(tokens: AuthData | null) {
  debugger;
  tokenCache.tokens = tokens;
  if (tokenCache.writeEnabled) {
    try {
      storage.oppTokens = JSON.stringify(tokens);
    } catch (err) {
      // write failed, ignore it. Happens if storage is full or private mode.
    }
  }
}

export function enableWrite() {
  tokenCache.writeEnabled = true;
  if (tokenCache.tokens) {
    saveTokens(tokenCache.tokens);
    }
}

export function loadTokens() {
  debugger;
  if (tokenCache.tokens === undefined) {
    try {
      const tokens = storage.oppTokens;
      if (tokens) {
        tokenCache.tokens = JSON.parse(tokens);
        tokenCache.writeEnabled = true;
      } else {
        tokenCache.tokens = null;
      }
    } catch (err) {
      tokenCache.tokens = null;
    }
  }
  return tokenCache.tokens;
}
