import { OpenPeerPower } from "../types";

export interface Webhook {
  webhook_id: string;
  domain: string;
  name: string;
}

export const fetchWebhooks = (hass: OpenPeerPower): Promise<Webhook[]> =>
  hass.callWS({
    type: "webhook/list",
  });
