import { OpenPeerPower } from "../../types";

export function computeRTL(opp: OpenPeerPower) {
  return false;
}

export function computeRTLDirection(opp: OpenPeerPower) {
  return computeRTL(opp) ? "rtl" : "ltr";
}
