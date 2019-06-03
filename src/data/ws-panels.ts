import { createCollection, Connection } from "../open-peer-power-js-websocket/lib";
import { Panels } from "../types";

export const subscribePanels = (
  conn: Connection,
  onChange: (panels: Panels) => void
) =>
  createCollection<Panels>(
    "_pnl",
    () => conn.sendMessagePromise({ type: "get_panels" }),
    undefined,
    conn,
    onChange
  );
