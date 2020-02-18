import { OpenPeerPower } from "../types";
import { fetchFrontendUserData, saveFrontendUserData } from "./frontend";

export interface FrontendTranslationData {
  language: string;
}

declare global {
  interface FrontendUserData {
    language: FrontendTranslationData;
  }
}

export const fetchTranslationPreferences = (opp: OpenPeerPower) => {
  fetchFrontendUserData(opp.connection, "language");
}

export const saveTranslationPreferences = (
  opp: OpenPeerPower,
  data: FrontendTranslationData
) => saveFrontendUserData(opp.connection, "language", data);
