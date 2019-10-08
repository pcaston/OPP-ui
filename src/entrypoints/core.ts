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

async function authProm() {
  return await loadTokens();
}
        
const access_token = authProm();
console.log(access_token);

debugger;
const connProm = async () => {
  try {
    const conn = await createConnection();
    return { conn };
  } catch (err) {
    if (err !== ERR_INVALID_AUTH) {
      throw err;
    }
    return null;
  }
};
debugger;
const ws = connProm();
console.log(ws);

window.oppConnection = { connProm };