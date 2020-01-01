import { OpenPeerPower } from "../../types";
import { UnsubscribeFunc } from "../../open-peer-power-js-websocket/lib";

export const subscribeOne = async <T>(
  conn: Connection,
  subscribe: (conn: Connection, onChange: (items: T) => void) => UnsubscribeFunc
) =>
  new Promise<T>((resolve) => {
    const unsub = subscribe(conn, (items) => {
      unsub();
      resolve(items);
    });
  });
