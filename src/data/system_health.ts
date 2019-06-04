import { OpenPeerPower } from "../types";

export interface OpenPeerPowerSystemHealthInfo {
  version: string;
  dev: boolean;
  hassio: boolean;
  virtualenv: string;
  python_version: string;
  docker: boolean;
  arch: string;
  timezone: string;
  os_name: string;
}

export interface SystemHealthInfo {
  [domain: string]: { [key: string]: string | number | boolean };
}

export const fetchSystemHealthInfo = (
  hass: OpenPeerPower
): Promise<SystemHealthInfo> =>
  hass.callWS({
    type: "system_health/info",
  });
