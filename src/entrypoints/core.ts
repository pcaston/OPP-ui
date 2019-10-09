import {
  createConnection,
  ERR_INVALID_AUTH,
  Connection,
} from "../open-peer-power-js-websocket/lib";

import { loadTokens } from "../common/auth/token_storage";

declare global {
  interface Window {
    oppConnection: Promise<{ conn: Connection }>;
  }
}

declare global {
  interface Window {
    __tokenCache: {
      // undefined: we haven't loaded yet
      // null: none stored
      tokens?: String | null;
      ws?: WebSocket | null;
    };
  }
}
declare global {
  interface Window {
    wsx: WebSocket;
  }
};

async function authProm() {
  return await loadTokens();
}
        
const access_token = authProm();
console.log(access_token);

const connProm = async () => {
  try {
    const conn = await createConnection();
    return conn;
  } catch (err) {
    if (err !== ERR_INVALID_AUTH) {
      throw err;
    }
    return null;
  }
};
debugger;
window.__tokenCache.ws = new WebSocket("ws://127.0.0.1:8123/api/websocket");
window.wsx = window.__tokenCache.ws;
console.log(window.wsx);