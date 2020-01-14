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
//@ts-ignore
const access_token = authProm();
//@ts-ignore
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

window.wsx = new WebSocket("ws://127.0.0.1:8123/api/websocket");