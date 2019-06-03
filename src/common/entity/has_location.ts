import { OppEntity } from "home-assistant-js-websocket";

export default function hasLocation(stateObj: OppEntity) {
  return (
    "latitude" in stateObj.attributes && "longitude" in stateObj.attributes
  );
}
