import { OpenPeerPower } from "../types";

export const setInputDateTimeValue = (
  hass: OpenPeerPower,
  entityId: string,
  time: string | undefined = undefined,
  date: string | undefined = undefined
) => {
  const param = { entity_id: entityId, time, date };
  hass.callService(entityId.split(".", 1)[0], "set_datetime", param);
};
