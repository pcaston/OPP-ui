import { createCollection, Connection } from "../open-peer-power-js-websocket/lib";
import { Themes } from "../types";

const fetchThemes = (conn) => {
  debugger;
  conn.sendMessagePromise({
    type: "frontend/get_themes",
  });
}

const subscribeUpdates = (conn, store) => {
  debugger;
  conn.subscribeEvents(
    (event) => store.setState(event.data, true),
    "themes_updated"
  );
}

export const subscribeThemes = (
  conn: Connection,
  onChange: (themes: Themes) => void
) =>
  createCollection<Themes>(
    "_thm",
    fetchThemes,
    subscribeUpdates,
    conn,
    onChange
  );
