import { OpenPeerPower } from "../types";
import { Connection } from "../open-peer-power-js-websocket/lib";
import { showConfirmationDialog } from "../dialogs/confirmation/show-dialog-confirmation";

export interface AuthProvider {
  name: string;
  id: string;
  type: string;
}

export interface Credential {
  type: string;
}

export interface SignedPath {
  path: string;
}

export interface LoginUser {
  client_id: string;
  name: string;
  username: string;
  password: string;
}

export const oppUrl = `${location.protocol}//${location.host}`;

export let invalidAuth: boolean = true;
export function SetinvalidAuth(set: boolean) {
  invalidAuth = set;
}

export const getSignedPath = (
  opp: OpenPeerPower,
  path: string
): Promise<SignedPath> => opp.callWS({ type: "auth/sign_path", path });

export const fetchAuthProviders = () =>
  fetch("/auth/providers", {
    credentials: "same-origin",
  });

export const loginUser = (
  conn: Connection,
  clientId: String,
  name: String,
  username: String,
  password: String
  ): Promise<LoginUser> =>
    conn.sendMessagePromise({
      type: "login",
      clientId,
      name,
      username,
      password
  });

