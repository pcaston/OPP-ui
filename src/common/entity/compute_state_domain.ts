import { OppEntity } from "home-assistant-js-websocket";
import computeDomain from "./compute_domain";

export default function computeStateDomain(stateObj: OppEntity) {
  return computeDomain(stateObj.entity_id);
}
