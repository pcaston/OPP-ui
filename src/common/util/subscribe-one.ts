import { OpenPeerPower } from "../../types";
import { UnsubscribeFunc } from "../../open-peer-power-js-websocket/lib";

export const subscribeOne = async <T>(
  opp: OpenPeerPower,
  subscribe: (
    opp: OpenPeerPower,
    onChange: (items: T) => void
  ) => UnsubscribeFunc
) =>
  new Promise<T>((resolve) => {
    const unsub = subscribe(opp, (items) => {
      unsub();
      resolve(items);
    });
  });
