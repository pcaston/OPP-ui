import {
  OppEntityBase,
  OppEntityAttributeBase,
  OpenPeerPower,
} from "../types";

export interface AutomationEntity extends OppEntityBase {
  attributes: OppEntityAttributeBase & {
    id?: string;
    last_triggered: string;
  };
}

export interface AutomationConfig {
  alias: string;
  trigger: any[];
  condition?: any[];
  action: any[];
}

export const deleteAutomation = (opp: OpenPeerPower, id: string) =>
  opp.callApi("DELETE", `config/automation/config/${id}`);
