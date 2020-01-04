import { STATES_OFF } from "../../../../common/const";
import { turnOnOffEntity } from "./turn-on-off-entity";
import { OpenPeerPower } from "../../../../types";
export const toggleEntity = (
  opp: OpenPeerPower,
  entityId: string
): Promise<void> => {
  const turnOn = STATES_OFF.includes(opp.states![entityId].state);
  return turnOnOffEntity(opp, entityId, turnOn);
};
