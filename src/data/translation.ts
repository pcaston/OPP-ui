import { HomeAssistant } from "../types";
import { fetchFrontendUserData, saveFrontendUserData } from "./frontend";

export interface FrontendTranslationData {
  language: string;
}

declare global {
  interface FrontendUserData {
    language: FrontendTranslationData;
  }
}

export const fetchTranslationPreferences = (opp: HomeAssistant) =>
  fetchFrontendUserData(opp, "language");

export const saveTranslationPreferences = (
  opp: HomeAssistant,
  data: FrontendTranslationData
) => saveFrontendUserData(opp, "language", data);

export const getOppTranslations = async (
  opp: HomeAssistant,
  language: string
): Promise<{}> => {
  const result = await opp.callWS<{ resources: {} }>({
    type: "frontend/get_translations",
    language,
  });
  return result.resources;
};
