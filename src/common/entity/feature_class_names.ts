import { OppEntity } from "../../types";
import { supportsFeature } from "./supports-feature";

// Expects classNames to be an object mapping feature-bit -> className
export default function featureClassNames(
  stateObj: OppEntity,
  classNames: { [feature: number]: string }
) {
  if (!stateObj || !stateObj.attributes.supported_features) {
    return "";
  }

  return Object.keys(classNames)
    .map((feature) =>
      supportsFeature(stateObj, Number(feature)) ? classNames[feature] : ""
    )
    .filter((attr) => attr !== "")
    .join(" ");
}
