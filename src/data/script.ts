import { OpenPeerPower } from "../types";
import computeObjectId from "../common/entity/compute_object_id";

export interface EventAction {
  event: string;
  event_data?: { [key: string]: any };
  event_data_template?: { [key: string]: any };
}

export const triggerScript = (
  opp: OpenPeerPower,
  entityId: string,
  variables?: {}
) => opp.callService("script", computeObjectId(entityId), variables);

export const deleteScript = (opp: OpenPeerPower, objectId: string) =>
  opp.callApi("DELETE", `config/script/config/${objectId}`);
