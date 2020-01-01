import { OpenPeerPower } from "../types";

declare global {
  // tslint:disable-next-line
  interface FrontendUserData {}
}

export type ValidUserDataKey = keyof FrontendUserData;

export const 
fetchFrontendUserData = async <
  UserDataKey extends ValidUserDataKey
>(
  opp: OpenPeerPower,
  key: UserDataKey
): Promise<FrontendUserData[UserDataKey] | null> => {
  const result = await opp.callWS<{
    value: FrontendUserData[UserDataKey] | null;
  }>({
    type: "frontend/get_user_data",
    key,
  });
  return result.value;
};

export const saveFrontendUserData = async <
  UserDataKey extends ValidUserDataKey
>(
  opp: OpenPeerPower,
  key: UserDataKey,
  value: FrontendUserData[UserDataKey]
): Promise<void> =>
  opp.callWS<void>({
    type: "frontend/set_user_data",
    key,
    value,
  });
