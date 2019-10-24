import { OppEntity } from "../../open-peer-power-js-websocket/lib";
import computeDomain from "./compute_domain";

export default function computeStateDomain(stateObj: OppEntity) {
  return computeDomain(stateObj.entity_id);
}
