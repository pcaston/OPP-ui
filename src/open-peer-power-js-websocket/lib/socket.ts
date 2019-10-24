/**
 * Create a web socket connection with a Open Peer Power instance.
 */
import {
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
  ERR_OPP_HOST_REQUIRED
} from "./errors";
import { ConnectionOptions, Error } from "./types";
import * as messages from "./messages";


const MSG_TYPE_AUTH_OK = "auth_ok";

export function createSocket(options: ConnectionOptions): Promise<WebSocket> {

  // Convert from http:// -> ws://, https:// -> wss://
  //const url = wsUrl;
  const url = "ws://127.0.0.1:8123/api/websocket";

  function connect(
    triesLeft: number,
    promResolve: (socket: WebSocket) => void,
    promReject: (err: Error) => void
  ) {
    const socket = new WebSocket(url);

    const closeMessage = () => {
      // If we are in error handler make sure close handler doesn't also fire.
      socket.removeEventListener("close", closeMessage);
      // Reject if we no longer have to retry
      if (triesLeft === 0) {
        // We never were connected and will not retry
        promReject(ERR_CANNOT_CONNECT);
        return;
      }

      const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
      // Try again in a second
      setTimeout(
        () =>
          connect(
            newTries,
            promResolve,
            promReject
          ),
        1000
      );
    };
    const handleMessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case MSG_TYPE_AUTH_OK:
          socket.removeEventListener("message", handleMessage);
          socket.removeEventListener("close", closeMessage);
          socket.removeEventListener("error", closeMessage);
          promResolve(socket);
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", closeMessage);
    socket.addEventListener("error", closeMessage);
  }

  return new Promise((resolve, reject) =>
    connect(
      options.setupRetry,
      resolve,
      reject
    )
  );
}
