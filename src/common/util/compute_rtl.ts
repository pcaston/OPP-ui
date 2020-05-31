import { OpenPeerPower } from "../../types";

export function computeRTL(opp: OpenPeerPower) {
  const lang = opp.language || "en";
  if (opp.translationMetadata.translations[lang]) {
    return opp.translationMetadata.translations[lang].isRTL || false;
  }
  return false;
}

export function computeRTLDirection(opp: OpenPeerPower) {
  return computeRTL(opp) ? "rtl" : "ltr";
}
