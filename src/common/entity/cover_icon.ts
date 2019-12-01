/** Return an icon representing a cover state. */
import { OppEntity } from "../../types";
import domainIcon from "./domain_icon";

export default function coverIcon(state: OppEntity): string {
  const open = state.state !== "closed";
  switch (state.attributes.device_class) {
    case "garage":
      return open ? "opp:garage-open" : "opp:garage";
    default:
      return domainIcon("cover", state.state);
  }
}
