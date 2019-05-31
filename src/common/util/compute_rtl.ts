import { HomeAssistant } from "../../types";

export function computeRTL(opp: HomeAssistant) {
  const lang = opp.language || "en";
  if (opp.translationMetadata.translations[lang]) {
    return opp.translationMetadata.translations[lang].isRTL || false;
  }
  return false;
}

export function computeRTLDirection(opp: HomeAssistant) {
  return computeRTL(opp) ? "rtl" : "ltr";
}
