import { ERR_OPP_HOST_REQUIRED, ERR_INVALID_AUTH } from "./errors";

export type AuthData = {
  oppUrl: string;
  clientId: string;
  expires?: number;
  refresh_token: string | Blob;
  access_token?: string;
  expires_in?: number;
};

export type SaveTokensFunc = (data: AuthData | null) => void;
export type LoadTokensFunc = () => Promise<AuthData | null | undefined>;

export type getAuthOptions = {
  oppUrl?: string;
  clientId?: string;
  authCode?: string;
  saveTokens?: SaveTokensFunc;
  loadTokens?: LoadTokensFunc;
};

//export const loginUser = (connection: Connection) =>
//  connection.sendMessagePromise<OppUser>(messages.login());

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

async function tokenRequest(
  oppUrl: string,
  clientId: string,
  data: AuthorizationCodeRequest | RefreshTokenRequest
) {
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
  tokens.expires = genExpires(tokens.expires_in!);
  return tokens;
}

export class Auth {
  private _saveTokens?: SaveTokensFunc;
  data: AuthData | null | undefined;

  constructor(data: AuthData, saveTokens?: SaveTokensFunc) {
    this.data = data;
    this._saveTokens = saveTokens;
  }

  get wsUrl() {
    // Convert from http:// -> ws://, https:// -> wss://
    //return `ws${this.data.oppUrl.substr(4)}/api/websocket`;
    return `ws://127.0.0.1:8123/api/websocket`;
  }

  get accessToken() {
    return this.data!.access_token;
  }

  get expired() {
    return Date.now() > this.data!.expires!;
  }

  /**
   * Refresh the access token.
   */
  async refreshAccessToken() {
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
    const formData = new FormData();
    formData.append("action", "revoke");
    formData.append("token", this.data.refresh_token);

    // There is no error checking, as revoke will always return 200
    await fetch(`${this.data!.oppUrl}/auth/token`, {
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
  let data: AuthData | null | undefined;

  let oppUrl = options.oppUrl;
  // Strip trailing slash.
  if (oppUrl && oppUrl[oppUrl.length - 1] === "/") {
    oppUrl = oppUrl.substr(0, oppUrl.length - 1);
  }
  const clientId =
  options.clientId !== undefined ? options.clientId : genClientId();

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
  //redirectAuthorize(
  //  oppUrl,
  //  clientId,
  //  options.redirectUrl || genRedirectUrl(),
  //  encodeOAuthState({
  //    oppUrl,
  //   clientId
  // })
  //);
  // Just don't resolve while we navigate to next page
  //return new Promise<Auth>(() => {});
  data = 
    {oppUrl: oppUrl = oppUrl,
     clientId: oppUrl = clientId
    };
  return new Auth(data!, options.saveTokens);
}
