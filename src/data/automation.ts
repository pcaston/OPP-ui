import {
  OppEntityBase,
  OppEntityAttributeBase,
} from "../open-peer-power-js-websocket/lib";

export interface AutomationEntity extends OppEntityBase {
  attributes: OppEntityAttributeBase & {
    id?: string;
  };
}

export interface AutomationConfig {
  alias: string;
  trigger: any[];
  condition?: any[];
  action: any[];
}
