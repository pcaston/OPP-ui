import {
  ERR_INVALID_AUTH,
  subscribeEntities,
  subscribeServices,
  callService,
  Auth,
  Connection,
} from "../open-peer-power-js-websocket/lib";

import { getState } from "../util/op-pref-storage";
import { fetchWithAuth } from "../util/fetch-with-auth";
import oppCallApi from "../util/opp-call-api";
import { forwardHaptic } from "../data/haptics";
import { fireEvent } from "../common/dom/fire_event";
import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { broadcastConnectionStatus } from "../data/connection-status";

export const connectionMixin = (
  superClass: Constructor<LitElement & OppBaseEl>
) =>
  class extends superClass {
    protected initializeOpp(auth: Auth, conn: Connection) {
      console.log("Opp Initialise 2");
      this.opp = {
        connection: conn,
        connected: true,
        states: null as any,
        config: null as any,
        panels: null as any,
        services: null as any,
        user: null as any,
        panelUrl: (this as any)._panelUrl,
        resources: null as any,
        dockedSidebar: false,
        moreInfoEntityId: null,

        // For messages that do not get a response
        sendWS: (msg) => {
          if (__DEV__) {
            // tslint:disable-next-line: no-console
            console.log("Sending", msg);
          }
          conn.sendMessage(msg);
        },
        // For messages that expect a response
        callWS: <T>(msg) => {
          if (__DEV__) {
            // tslint:disable-next-line: no-console
            console.log("Sending", msg);
          }

          const resp = conn.sendMessagePromise<T>(msg);

          if (__DEV__) {
            resp.then(
              // tslint:disable-next-line: no-console
              (result) => console.log("Received", result),
              // tslint:disable-next-line: no-console
              (err) => console.error("Error", err)
            );
          }
          return resp;
        },
        ...getState(),
        ...this._pendingOpp,
      };

      this.oppConnected();
    }

    protected oppConnected() {
      super.oppConnected();

      const conn = this.opp!.connection;

      broadcastConnectionStatus("connected");

      conn.addEventListener("ready", () => this.oppReconnected());
      conn.addEventListener("disconnected", () => this.oppDisconnected());
      // If we reconnect after losing connection and auth is no longer valid.
      conn.addEventListener("reconnect-error", (_conn, err) => {
        if (err === ERR_INVALID_AUTH) {
          broadcastConnectionStatus("auth-invalid");
          location.reload();
        }
      });

      subscribeEntities(conn, (states) => this._updateOpp({ states }));
    }

    protected oppReconnected() {
      super.oppReconnected();
      this._updateOpp({ connected: true });
      broadcastConnectionStatus("connected");
    }

    protected oppDisconnected() {
      super.oppDisconnected();
      this._updateOpp({ connected: false });
      broadcastConnectionStatus("disconnected");
    }
  };
