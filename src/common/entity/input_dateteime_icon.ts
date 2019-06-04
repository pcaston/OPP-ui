/** Return an icon representing an input datetime state. */
import domainIcon from "./domain_icon";
import { OppEntity } from "../../open-peer-power-js-websocket/lib";

export default function inputDateTimeIcon(state: OppEntity): string {
  if (!state.attributes.has_date) {
    return "opp:clock";
  }
  if (!state.attributes.has_time) {
    return "opp:calendar";
  }
  return domainIcon("input_datetime");
}
