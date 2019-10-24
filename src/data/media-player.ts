import { OpenPeerPower } from "../types";

import { timeCachePromiseFunc } from "../common/util/time-cache-function-promise";

export const SUPPORT_PAUSE = 1;
export const SUPPORT_NEXT_TRACK = 32;
export const SUPPORTS_PLAY = 16384;
export const OFF_STATES = ["off", "idle"];

export interface MediaPlayerThumbnail {
  content_type: string;
  content: string;
}

export const fetchMediaPlayerThumbnailWithCache = (
  opp: OpenPeerPower,
  entityId: string
) =>
  timeCachePromiseFunc(
    "_media_playerTmb",
    9000,
    fetchMediaPlayerThumbnail,
    opp,
    entityId
  );

export const fetchMediaPlayerThumbnail = (
  opp: OpenPeerPower,
  entityId: string
) => {
  return opp.callWS<MediaPlayerThumbnail>({
    type: "media_player_thumbnail",
    entity_id: entityId,
  });
};
