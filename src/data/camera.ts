import { OpenPeerPower, CameraEntity } from "../types";
import { timeCachePromiseFunc } from "../common/util/time-cache-function-promise";
import { getSignedPath } from "./auth";

export const CAMERA_SUPPORT_ON_OFF = 1;
export const CAMERA_SUPPORT_STREAM = 2;

export interface CameraPreferences {
  preload_stream: boolean;
}

export interface CameraThumbnail {
  content_type: string;
  content: string;
}

export interface Stream {
  url: string;
}

export const computeMJPEGStreamUrl = (entity: CameraEntity) =>
  `/api/camera_proxy_stream/${entity.entity_id}?token=${entity.attributes.access_token}`;

export const fetchThumbnailUrlWithCache = (
  opp: OpenPeerPower,
  entityId: string
) =>
  timeCachePromiseFunc("_cameraTmbUrl", 9000, fetchThumbnailUrl, opp, entityId);

export const fetchThumbnailUrl = async (
  opp: OpenPeerPower,
  entityId: string
) => {
  const path = await getSignedPath(opp, `/api/camera_proxy/${entityId}`);
  return opp.oppUrl(path.path);
};

export const fetchThumbnail = (opp: OpenPeerPower, entityId: string) => {
  // tslint:disable-next-line: no-console
  console.warn("This method has been deprecated.");
  return opp.callWS<CameraThumbnail>({
    type: "camera_thumbnail",
    entity_id: entityId,
  });
};

export const fetchStreamUrl = async (
  opp: OpenPeerPower,
  entityId: string,
  format?: "hls"
) => {
  const data = {
    type: "camera/stream",
    entity_id: entityId,
  };
  if (format) {
    // @ts-ignore
    data.format = format;
  }
  const stream = await opp.callWS<Stream>(data);
  stream.url = opp.oppUrl(stream.url);
  return stream;
};

export const fetchCameraPrefs = (opp: OpenPeerPower, entityId: string) =>
  opp.callWS<CameraPreferences>({
    type: "camera/get_prefs",
    entity_id: entityId,
  });

export const updateCameraPrefs = (
  opp: OpenPeerPower,
  entityId: string,
  prefs: {
    preload_stream?: boolean;
  }
) =>
  opp.callWS<CameraPreferences>({
    type: "camera/update_prefs",
    entity_id: entityId,
    ...prefs,
  });
