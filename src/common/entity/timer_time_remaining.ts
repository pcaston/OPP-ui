import { OppEntity } from "../../open-peer-power-js-websocket/lib";
import durationToSeconds from "../datetime/duration_to_seconds";

export default function timerTimeRemaining(stateObj: OppEntity) {
  let timeRemaining = durationToSeconds(stateObj.attributes.remaining);

  if (stateObj.state === "active") {
    const now = new Date().getTime();
    const madeActive = new Date(stateObj.last_changed).getTime();
    timeRemaining = Math.max(timeRemaining - (now - madeActive) / 1000, 0);
  }

  return timeRemaining;
}
