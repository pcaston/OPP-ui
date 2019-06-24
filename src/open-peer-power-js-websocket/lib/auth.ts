import { parseQuery } from "./util";
import { ERR_OPP_HOST_REQUIRED, ERR_INVALID_AUTH } from "./errors";

export type AuthData = {
  oppUrl: string;
  clientId: string;
  expires: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

export type SaveTokensFunc = (data: AuthData | null) => void;
export type LoadTokensFunc = () => Promise<AuthData | null | undefined>;

export type getAuthOptions = {
  oppUrl?: string;
  clientId?: string;
  redirectUrl?: string;
  authCode?: string;
  saveTokens?: SaveTokensFunc;
  loadTokens?: LoadTokensFunc;
};

type QueryCallbackData =
  | {}
  | {
      state: string;
      code: string;
      auth_callback: string;
    };

type OAuthState = {
  oppUrl: string;
  clientId: string;
};

type AuthorizationCodeRequest = {
  grant_type: "authorization_code";
  code: string;
};

type RefreshTokenRequest = {
  grant_type: "refresh_token";
  refresh_token: string;
};

export const genClientId = (): string =>
  `${location.protocol}//${location.host}/`;

export const genExpires = (expires_in: number): number => {
  return expires_in * 1000 + Date.now();
};

function genRedirectUrl() {
  // Get current url but without # part.
  debugger;
  const { protocol, host, pathname, search } = location;
  return `${protocol}//${host}${pathname}${search}`;
}

function genAuthorizeUrl(
  oppUrl: string,
  clientId: string,
  redirectUrl: string,
  state: string
) {
  debugger;
  let authorizeUrl = `${oppUrl}/auth/authorize?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUrl)}`;

  if (state) {
    authorizeUrl += `&state=${encodeURIComponent(state)}`;
  }
  return authorizeUrl;
}

function redirectAuthorize(
  oppUrl: string,
  clientId: string,
  redirectUrl: string,
  state: string
) {
  // Add either ?auth_callback=1 or &auth_callback=1
  debugger;
  redirectUrl += (redirectUrl.includes("?") ? "&" : "?") + "auth_callback=1";

  document.location!.href = genAuthorizeUrl(
    oppUrl,
    clientId,
    redirectUrl,
    state
  );
}

async function tokenRequest(
  oppUrl: string,
  clientId: string,
  data: AuthorizationCodeRequest | RefreshTokenRequest
) {
  debugger;
  const formData = new FormData();
  formData.append("client_id", clientId);
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  const resp = await fetch(`${oppUrl}/auth/token`, {
    method: "POST",
    credentials: "same-origin",
    body: formData
  });

  if (!resp.ok) {
    throw resp.status === 400 /* auth invalid */ ||
    resp.status === 403 /* user not active */
      ? ERR_INVALID_AUTH
      : new Error("Unable to fetch tokens");
  }

  const tokens: AuthData = await resp.json();
  tokens.oppUrl = oppUrl;
  tokens.clientId = clientId;
  tokens.expires = genExpires(tokens.expires_in);
  return tokens;
}

function fetchToken(oppUrl: string, clientId: string, code: string) {
  debugger;
  return tokenRequest(oppUrl, clientId, {
    code,
    grant_type: "authorization_code"
  });
}

function encodeOAuthState(state: OAuthState): string {
  return btoa(JSON.stringify(state));
}

function decodeOAuthState(encoded: string): OAuthState {
  return JSON.parse(atob(encoded));
}

export class Auth {
  private _saveTokens?: SaveTokensFunc;
  data: AuthData;

  constructor(data: AuthData, saveTokens?: SaveTokensFunc) {
    debugger;
    this.data = data;
    this._saveTokens = saveTokens;
  }

  get wsUrl() {
    // Convert from http:// -> ws://, https:// -> wss://
    return `ws${this.data.oppUrl.substr(4)}/api/websocket`;
  }

  get accessToken() {
    return this.data.access_token;
  }

  get expired() {
    return Date.now() > this.data.expires;
  }

  /**
   * Refresh the access token.
   */
  async refreshAccessToken() {
    debugger;
    const data = await tokenRequest(this.data.oppUrl, this.data.clientId, {
      grant_type: "refresh_token",
      refresh_token: this.data.refresh_token
    });
    // Access token response does not contain refresh token.
    data.refresh_token = this.data.refresh_token;
    this.data = data;
    if (this._saveTokens) this._saveTokens(data);
  }

  /**
   * Revoke the refresh & access tokens.
   */
  async revoke() {
    debugger;
    const formData = new FormData();
    formData.append("action", "revoke");
    formData.append("token", this.data.refresh_token);

    // There is no error checking, as revoke will always return 200
    await fetch(`${this.data.oppUrl}/auth/token`, {
      method: "POST",
      credentials: "same-origin",
      body: formData
    });

    if (this._saveTokens) {
      this._saveTokens(null);
    }
  }
}

export async function getAuth(options: getAuthOptions = {}): Promise<Auth> {
  debugger;
  let data: AuthData | null | undefined;

  let oppUrl = options.oppUrl;
  // Strip trailing slash.
  if (oppUrl && oppUrl[oppUrl.length - 1] === "/") {
    oppUrl = oppUrl.substr(0, oppUrl.length - 1);
  }
  const clientId = options.clientId || genClientId();

  // Use auth code if it was passed in
  if (!data && options.authCode && oppUrl && clientId) {
    try {
      data = await fetchToken(oppUrl, clientId, options.authCode);
      if (options.saveTokens) {
        options.saveTokens(data);
      }
    } catch (err) {
      // Do we want to tell user we were unable to fetch tokens?
      // For now we don't do anything, having rest of code pick it up.
      console.log("Unable to fetch access token", err);
    }
  }

  // Check if we came back from an authorize redirect
  if (!data) {
    const query = parseQuery<QueryCallbackData>(location.search.substr(1));

    // Check if we got redirected here from authorize page
    if ("auth_callback" in query) {
      // Restore state
      const state = decodeOAuthState(query.state);
      try {
        data = await fetchToken(state.oppUrl, state.clientId, query.code);
        if (options.saveTokens) {
          options.saveTokens(data);
        }
      } catch (err) {
        // Do we want to tell user we were unable to fetch tokens?
        // For now we don't do anything, having rest of code pick it up.
        console.log("Unable to fetch access token", err);
      }
    }
  }

  // Check for stored tokens
  if (!data && options.loadTokens) {
    data = await options.loadTokens();
  }

  if (data) {
    return new Auth(data, options.saveTokens);
  }

  if (oppUrl === undefined) {
    throw ERR_OPP_HOST_REQUIRED;
  }

  // If no tokens found but a oppUrl was passed in, let's go get some tokens!
  redirectAuthorize(
    oppUrl,
    clientId,
    options.redirectUrl || genRedirectUrl(),
    encodeOAuthState({
      oppUrl,
      clientId
    })
  );
  // Just don't resolve while we navigate to next page
  return new Promise<Auth>(() => {});
}
