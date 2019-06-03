import { OpenPeerPower } from "../types";

export const fetchErrorLog = (hass: OpenPeerPower) =>
  hass.callApi<string>("GET", "error_log");
