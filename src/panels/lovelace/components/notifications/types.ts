import { OppEntity } from "../../../../open-peer-power-js-websocket/lib";

export declare type OppNotification = OppEntity & {
  notification_id?: string;
  created_at?: string;
  title?: string;
  message?: string;
};
