import { OppEntity } from "../../open-peer-power-js-websocket/lib";

export default function hasLocation(stateObj: OppEntity) {
  return (
    "latitude" in stateObj.attributes && "longitude" in stateObj.attributes
  );
}
