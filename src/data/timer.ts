import {
  OppEntityBase,
  OppEntityAttributeBase,
} from "../open-peer-power-js-websocket/lib";

export type TimerEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    duration: string;
    remaining: string;
  };
};
