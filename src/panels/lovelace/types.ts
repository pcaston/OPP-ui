import { OpenPeerPower } from "../../types";
import { LovelaceCardConfig, LovelaceConfig } from "../../data/lovelace";

declare global {
  // tslint:disable-next-line
  interface OPPDomEvents {
    "ll-rebuild": {};
  }
}

export interface Lovelace {
  config: LovelaceConfig;
  editMode: boolean;
  mode: "generated" | "yaml" | "storage";
  enableFullEditMode: () => void;
  setEditMode: (editMode: boolean) => void;
  saveConfig: (newConfig: LovelaceConfig) => Promise<void>;
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
