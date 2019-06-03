import { OppEntity } from "home-assistant-js-websocket";
import canToggleState from "./can_toggle_state";
import computeStateDomain from "./compute_state_domain";
import { DOMAINS_WITH_CARD } from "../const";
import { OpenPeerPower } from "../../types";

export default function stateCardType(
  hass: OpenPeerPower,
  stateObj: OppEntity
) {
  if (stateObj.state === "unavailable") {
    return "display";
  }

  const domain = computeStateDomain(stateObj);

  if (DOMAINS_WITH_CARD.includes(domain)) {
    return domain;
  }
  if (
    canToggleState(hass, stateObj) &&
    stateObj.attributes.control !== "hidden"
  ) {
    return "toggle";
  }
  return "display";
}
