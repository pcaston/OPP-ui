import { STATES_OFF } from "../../../../common/const";
import { turnOnOffEntity } from "./turn-on-off-entity";
import { OpenPeerPower } from "../../../../types";
export const toggleEntity = (
  hass: OpenPeerPower,
  entityId: string
): Promise<void> => {
  const turnOn = STATES_OFF.includes(hass.states[entityId].state);
  return turnOnOffEntity(hass, entityId, turnOn);
};
