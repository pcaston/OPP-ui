import { OpenPeerPower } from "../../types";
import {
  LovelaceCardConfig,
  LovelaceConfig,
  LovelaceBadgeConfig,
} from "../../data/lovelace";

declare global {
  // tslint:disable-next-line
  interface OPPDomEvents {
    "ll-rebuild": {};
    "ll-badge-rebuild": {};
  }
}

export interface Lovelace {
  config: LovelaceConfig;
  editMode: boolean;
  mode: "generated" | "yaml" | "storage";
  language: string;
  enableFullEditMode: () => void;
  setEditMode: (editMode: boolean) => void;
  saveConfig: (newConfig: LovelaceConfig) => Promise<void>;
}

export interface LovelaceBadge extends HTMLElement {
  opp?: OpenPeerPower;
  setConfig(config: LovelaceBadgeConfig): void;
}

export interface LovelaceCard extends HTMLElement {
  opp?: OpenPeerPower;
  isPanel?: boolean;
  getCardSize(): number;
  setConfig(config: LovelaceCardConfig): void;
}

export interface LovelaceCardEditor extends HTMLElement {
  opp?: OpenPeerPower;
  setConfig(config: LovelaceCardConfig): void;
}
