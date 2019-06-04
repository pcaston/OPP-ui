import { OpenPeerPower } from "../../types";

export default function canToggleDomain(hass: OpenPeerPower, domain: string) {
  const services = hass.services[domain];
  if (!services) {
    return false;
  }

  if (domain === "lock") {
    return "lock" in services;
  }
  if (domain === "cover") {
    return "open_cover" in services;
  }
  return "turn_on" in services;
}
