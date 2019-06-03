import { OpenPeerPower } from "../../types";
import { UnsubscribeFunc } from "home-assistant-js-websocket";

export const subscribeOne = async <T>(
  hass: OpenPeerPower,
  subscribe: (
    hass: OpenPeerPower,
    onChange: (items: T) => void
  ) => UnsubscribeFunc
) =>
  new Promise<T>((resolve) => {
    const unsub = subscribe(hass, (items) => {
      unsub();
      resolve(items);
    });
  });
