import { OppEntity } from "../../websocket/lib";
import { canToggleDomain } from "./can_toggle_domain";
import { computeStateDomain } from "./compute_state_domain";
import { OpenPeerPower } from "../../types";
import { supportsFeature } from "./supports-feature";

export const canToggleState = (opp: OpenPeerPower, stateObj: OppEntity) => {
  const domain = computeStateDomain(stateObj);
  if (domain === "group") {
    return stateObj.state === "on" || stateObj.state === "off";
  }
  if (domain === "climate") {
    return supportsFeature(stateObj, 4096);
  }

  return canToggleDomain(opp, domain);
};
