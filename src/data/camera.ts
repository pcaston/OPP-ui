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
  `/api/camera_proxy_stream/${entity.entity_id}?token=${
    entity.attributes.access_token
  }`;

export const fetchThumbnailUrlWithCache = (
  hass: OpenPeerPower,
  entityId: string
) =>
  timeCachePromiseFunc(
    "_cameraTmbUrl",
    9000,
    fetchThumbnailUrl,
    hass,
    entityId
  );

export const fetchThumbnailUrl = (hass: OpenPeerPower, entityId: string) =>
  getSignedPath(hass, `/api/camera_proxy/${entityId}`).then(({ path }) => path);

export const fetchThumbnail = (hass: OpenPeerPower, entityId: string) => {
  // tslint:disable-next-line: no-console
  console.warn("This method has been deprecated.");
  return hass.callWS<CameraThumbnail>({
    type: "camera_thumbnail",
    entity_id: entityId,
  });
};

export const fetchStreamUrl = (
  hass: OpenPeerPower,
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
  return hass.callWS<Stream>(data);
};

export const fetchCameraPrefs = (hass: OpenPeerPower, entityId: string) =>
  hass.callWS<CameraPreferences>({
    type: "camera/get_prefs",
    entity_id: entityId,
  });

export const updateCameraPrefs = (
  hass: OpenPeerPower,
  entityId: string,
  prefs: {
    preload_stream?: boolean;
  }
) =>
  hass.callWS<CameraPreferences>({
    type: "camera/update_prefs",
    entity_id: entityId,
    ...prefs,
  });
