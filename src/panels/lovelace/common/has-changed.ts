import { OpenPeerPower } from "../../../types";
import { PropertyValues } from "lit-element";

// Check if config or Entity changed
export function hasConfigOrEntityChanged(
  element: any,
  changedProps: PropertyValues
): boolean {
  if (changedProps.has("_config")) {
    return true;
  }

  const oldHass = changedProps.get("opp") as OpenPeerPower | undefined;
  if (oldHass) {
    return (
      oldHass.states[element._config!.entity] !==
      element.opp!.states[element._config!.entity]
    );
  }

  return true;
}
