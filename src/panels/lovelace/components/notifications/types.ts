import { OppEntity } from "../../../../types";

export declare type OppNotification = OppEntity & {
  notification_id?: string;
  created_at?: string;
  title?: string;
  message?: string;
};
