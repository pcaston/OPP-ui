import { createCollection, Connection } from "../open-peer-power-js-websocket/lib";
import { Themes } from "../types";

const fetchThemes = (conn) => {
  conn.sendMessagePromise({
    type: "frontend/get_themes",
  });
}

const subscribeUpdates = (conn, store) => {
  conn.subscribeEvents(
    (event) => store.setState(event.data, true),
    "themes_updated"
  );
}