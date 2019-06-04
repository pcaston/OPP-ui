import { Auth } from "../open-peer-power-js-websocket/lib";

export const fetchWithAuth = async (
  auth: Auth,
  input: RequestInfo,
  init: RequestInit = {}
) => {
  if (auth.expired) {
    await auth.refreshAccessToken();
  }
  init.credentials = "same-origin";
  if (!init.headers) {
    init.headers = {};
  }
  if (!init.headers) {
    init.headers = {};
  }
  // @ts-ignore
  init.headers.authorization = `Bearer ${auth.accessToken}`;
  return fetch(input, init);
};
