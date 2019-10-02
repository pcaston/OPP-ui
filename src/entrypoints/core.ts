import {
  getAuth,
  createConnection,
  ERR_INVALID_AUTH,
  Auth,
  Connection,
} from "../open-peer-power-js-websocket/lib";

import { loadTokens, saveTokens } from "../common/auth/token_storage";
import { oppUrl } from "../data/auth";
debugger;
declare global {
  interface Window {
    oppConnection: Promise<{ auth: Auth; conn: Connection }>;
  }
}

const authProm = () =>
      getAuth({
        oppUrl,
        saveTokens,
        loadTokens: () => Promise.resolve(loadTokens()),
      });

const connProm = async (auth) => {
  try {
    const conn = await createConnection({ auth });

    // Clear url if we have been able to establish a connection
    if (location.search.includes("auth_callback=1")) {
      history.replaceState(null, "", location.pathname);
    }

    return { auth, conn };
  } catch (err) {
    if (err !== ERR_INVALID_AUTH) {
      throw err;
    }
    // We can get invalid auth if auth tokens were stored that are no longer valid
    // Clear stored tokens.
    saveTokens(null);
    auth = await authProm();
    const conn = await createConnection({ auth });
    return { auth, conn };
  }
};

window.oppConnection = authProm().then(connProm);