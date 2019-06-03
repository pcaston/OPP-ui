import { OpenPeerPower, PanelInfo } from "../types";

export type OppioPanelInfo = PanelInfo<
  | undefined
  | {
      ingress?: string;
    }
>;

interface OppioResponse<T> {
  data: T;
  result: "ok";
}

interface CreateSessionResponse {
  session: string;
}

export interface OppioAddonInfo {
  name: string;
  slug: string;
  description: string;
  repository: "core" | "local" | string;
  version: string;
  installed: string | undefined;
  detached: boolean;
  available: boolean;
  build: boolean;
  url: string | null;
  icon: boolean;
  logo: boolean;
}

export interface OppioAddonDetails {
  name: string;
  slug: string;
  description: string;
  long_description: null | string;
  auto_update: boolean;
  url: null | string;
  detached: boolean;
  available: boolean;
  arch: "armhf" | "aarch64" | "i386" | "amd64";
  machine: any;
  openpeerpower: string;
  repository: null | string;
  version: null | string;
  last_version: string;
  state: "none" | "started" | "stopped";
  boot: "auto" | "manual";
  build: boolean;
  options: object;
  network: null | object;
  host_network: boolean;
  host_pid: boolean;
  host_ipc: boolean;
  host_dbus: boolean;
  privileged: any;
  apparmor: "disable" | "default" | "profile";
  devices: string[];
  auto_uart: boolean;
  icon: boolean;
  logo: boolean;
  changelog: boolean;
  hassio_api: boolean;
  hassio_role: "default" | "openpeerpower" | "manager" | "admin";
  openpeerpower_api: boolean;
  auth_api: boolean;
  full_access: boolean;
  protected: boolean;
  rating: "1-6";
  stdin: boolean;
  webui: null | string;
  gpio: boolean;
  kernel_modules: boolean;
  devicetree: boolean;
  docker_api: boolean;
  audio: boolean;
  audio_input: null | string;
  audio_output: null | string;
  services_role: string[];
  discovery: string[];
  ip_address: string;
  ingress: boolean;
  ingress_entry: null | string;
  ingress_url: null | string;
}

export interface OppioAddonRepository {
  slug: string;
  name: string;
  source: string;
  url: string;
  maintainer: string;
}

export interface OppioAddonsInfo {
  addons: OppioAddonInfo[];
  repositories: OppioAddonRepository[];
}
export interface OppioOppOSInfo {
  version: string;
  version_cli: string;
  version_latest: string;
  version_cli_latest: string;
  board: "ova" | "rpi";
}
export type OppioOpenPeerPowerInfo = any;
export type OppioSupervisorInfo = any;
export type OppioHostInfo = any;

export interface OppioSnapshot {
  slug: string;
  date: string;
  name: string;
  type: "full" | "partial";
  protected: boolean;
}

export interface OppioSnapshotDetail extends OppioSnapshot {
  size: string;
  openpeerpower: string;
  addons: Array<{
    slug: "ADDON_SLUG";
    name: "NAME";
    version: "INSTALLED_VERSION";
    size: "SIZE_IN_MB";
  }>;
  repositories: string[];
  folders: string[];
}

export interface OppioFullSnapshotCreateParams {
  name: string;
  password?: string;
}
export interface OppioPartialSnapshotCreateParams {
  name: string;
  folders: string[];
  addons: string[];
  password?: string;
}

const hassioApiResultExtractor = <T>(response: OppioResponse<T>) =>
  response.data;

export const createOppioSession = async (hass: OpenPeerPower) => {
  const response = await hass.callApi<OppioResponse<CreateSessionResponse>>(
    "POST",
    "hassio/ingress/session"
  );
  document.cookie = `ingress_session=${
    response.data.session
  };path=/api/hassio_ingress/`;
};

export const reloadOppioAddons = (hass: OpenPeerPower) =>
  hass.callApi<unknown>("POST", `hassio/addons/reload`);

export const fetchOppioAddonsInfo = (hass: OpenPeerPower) =>
  hass
    .callApi<OppioResponse<OppioAddonsInfo>>("GET", `hassio/addons`)
    .then(hassioApiResultExtractor);

export const fetchOppioAddonInfo = (hass: OpenPeerPower, addon: string) =>
  hass
    .callApi<OppioResponse<OppioAddonDetails>>(
      "GET",
      `hassio/addons/${addon}/info`
    )
    .then(hassioApiResultExtractor);

export const fetchOppioSupervisorInfo = (hass: OpenPeerPower) =>
  hass
    .callApi<OppioResponse<OppioSupervisorInfo>>(
      "GET",
      "hassio/supervisor/info"
    )
    .then(hassioApiResultExtractor);

export const fetchOppioHostInfo = (hass: OpenPeerPower) =>
  hass
    .callApi<OppioResponse<OppioHostInfo>>("GET", "hassio/host/info")
    .then(hassioApiResultExtractor);

export const fetchOppioOpenPeerPowerInfo = (hass: OpenPeerPower) =>
  hass
    .callApi<OppioResponse<OppioOpenPeerPowerInfo>>(
      "GET",
      "hassio/openpeerpower/info"
    )
    .then(hassioApiResultExtractor);

export const fetchOppioSnapshots = (hass: OpenPeerPower) =>
  hass
    .callApi<OppioResponse<{ snapshots: OppioSnapshot[] }>>(
      "GET",
      "hassio/snapshots"
    )
    .then((resp) => resp.data.snapshots);

export const reloadOppioSnapshots = (hass: OpenPeerPower) =>
  hass.callApi<unknown>("POST", `hassio/snapshots/reload`);

export const createOppioFullSnapshot = (
  hass: OpenPeerPower,
  data: OppioFullSnapshotCreateParams
) => hass.callApi<unknown>("POST", "hassio/snapshots/new/full", data);

export const createOppioPartialSnapshot = (
  hass: OpenPeerPower,
  data: OppioPartialSnapshotCreateParams
) => hass.callApi<unknown>("POST", "hassio/snapshots/new/partial", data);

export const fetchOppioSnapshotInfo = (
  hass: OpenPeerPower,
  snapshot: string
) =>
  hass
    .callApi<OppioResponse<OppioSnapshotDetail>>(
      "GET",
      `hassio/snapshots/${snapshot}/info`
    )
    .then(hassioApiResultExtractor);
