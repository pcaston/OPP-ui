import { OpenPeerPower } from "../types";

export const setInputSelectOption = (
  hass: OpenPeerPower,
  entity: string,
  option: string
) =>
  hass.callService("input_select", "select_option", {
    option,
    entity_id: entity,
  });
