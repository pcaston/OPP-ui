import computeDomain from "../../../../common/entity/compute_domain";
import { OpenPeerPower } from "../../../../types";

export const turnOnOffEntity = (
  opp: OpenPeerPower,
  entityId: string,
  turnOn = true
): Promise<void> => {
  const stateDomain = computeDomain(entityId);
  const serviceDomain = stateDomain === "group" ? "openPeerPower" : stateDomain;

  let service;
  switch (stateDomain) {
    case "lock":
      service = turnOn ? "unlock" : "lock";
      break;
    case "cover":
      service = turnOn ? "open_cover" : "close_cover";
      break;
    default:
      service = turnOn ? "turn_on" : "turn_off";
  }

  return opp.callService(serviceDomain, service, { entity_id: entityId });
};
