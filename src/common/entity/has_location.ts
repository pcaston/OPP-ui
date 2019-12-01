import { OppEntity } from "../../types";

export default function hasLocation(stateObj: OppEntity) {
  return (
    "latitude" in stateObj.attributes && "longitude" in stateObj.attributes
  );
}
