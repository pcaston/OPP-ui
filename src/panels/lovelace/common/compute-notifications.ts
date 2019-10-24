import { OppEntities, OppEntity } from "../../../open-peer-power-js-websocket/lib";

import computeDomain from "../../../common/entity/compute_domain";

export const computeNotifications = (states: OppEntities): OppEntity[] => {
  return Object.keys(states)
    .filter((entityId) => computeDomain(entityId) === "configurator")
    .map((entityId) => states[entityId]);
};
