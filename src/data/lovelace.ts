import { OpenPeerPower } from "../types";
import { Connection } from "open-peer-power-js-websocket";

export interface LovelaceConfig {
  title?: string;
  views: LovelaceViewConfig[];
  background?: string;
  resources?: Array<{ type: "css" | "js" | "module" | "html"; url: string }>;
}

export interface LovelaceViewConfig {
  index?: number;
  title?: string;
  badges?: string[];
  cards?: LovelaceCardConfig[];
  path?: string;
  icon?: string;
  theme?: string;
  panel?: boolean;
  background?: string;
}

export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  type: string;
  [key: string]: any;
}

export interface ToggleActionConfig {
  action: "toggle";
}

export interface CallServiceActionConfig {
  action: "call-service";
  service: string;
  service_data?: {
    entity_id?: string | [string];
    [key: string]: any;
  };
}

export interface NavigateActionConfig {
  action: "navigate";
  navigation_path: string;
}

export interface MoreInfoActionConfig {
  action: "more-info";
}

export interface NoActionConfig {
  action: "none";
}

export type ActionConfig =
  | ToggleActionConfig
  | CallServiceActionConfig
  | NavigateActionConfig
  | MoreInfoActionConfig
  | NoActionConfig;

export const fetchConfig = (
  conn: Connection,
  force: boolean
): Promise<LovelaceConfig> =>
  conn.sendMessagePromise({
    type: "lovelace/config",
    force,
  });

export const saveConfig = (
  opp: OpenPeerPower,
  config: LovelaceConfig
): Promise<void> =>
  opp.callWS({
    type: "lovelace/config/save",
    config,
  });
