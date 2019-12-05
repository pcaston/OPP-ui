import { OpenPeerPower } from "../../types";

/** Return if a component is loaded. */
export default function isComponentLoaded(
  opp: OpenPeerPower,
  component: string
): boolean {
  debugger;
  return opp && opp.config.components.indexOf(component) !== -1;
}
