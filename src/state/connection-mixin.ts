import {
  ERR_INVALID_AUTH,
  subscribeEntities,
  subscribeConfig,
  subscribeServices,
  callService,
  Auth,
  Connection,
} from "../open-peer-power-js-websocket/lib";

import translationMetadata  from "../../build-translations/translationMetadata.js";

import { getState } from "../util/op-pref-storage";
import { getLocalLanguage } from "../util/opp-translation";
import { fetchWithAuth } from "../util/fetch-with-auth";
import oppCallApi from "../util/opp-call-api";
import { subscribePanels } from "../data/ws-panels";
import { forwardHaptic } from "../data/haptics";
import { fireEvent } from "../common/dom/fire_event";
import { Constructor, ServiceCallResponse } from "../types";
import { LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { broadcastConnectionStatus } from "../data/connection-status";
import { invalidAuth } from "../data/auth"


export const connectionMixin = (
  superClass: Constructor<LitElement & OppBaseEl>
) =>
  class extends superClass {
    protected initializeOpp(auth: Auth, conn: Connection) {
      this.opp = {
        auth,
        connection: conn,
        connected: true,
        states: null as any,
        services: null as any,
        config: null as any,
        themes: null as any,
        selectedTheme: null as any,
        panels: null as any,
        user: null as any,
        panelUrl: (this as any)._panelUrl,

        language: getLocalLanguage(),
        selectedLanguage: null,
        resources: null as any,
        localize: () => "",

        translationMetadata,
        dockedSidebar: "docked",
        vibrate: true,
        moreInfoEntityId: null,
        callService: async (domain, service, serviceData = {}) => {
          try {
            return (await callService(
              conn,
              domain,
              service,
              serviceData
            )) as Promise<ServiceCallResponse>;
          } catch (err) {
            forwardHaptic("failure");
            const message =
              (this as any).opp.localize(
                "ui.notification_toast.service_call_failed",
                "service",
                `${domain}/${service}`
              ) + ` ${err.message}`;
            fireEvent(this as any, "opp-notification", { message });
            throw err;
          }
        },
        callApi: async (method, path, parameters) =>
          oppCallApi(auth, method, path, parameters),
        fetchWithAuth: (path, init) =>
          fetchWithAuth(auth, `${auth.data.oppUrl}${path}`, init),
        // For messages that do not get a response
        sendWS: (msg) => {
          conn.sendMessage(msg);
        },
        // For messages that expect a response
        callWS: <R>(msg) => {
          const resp = conn.sendMessagePromise<R>(msg);
          return resp;
        },
        ...getState(),
        ...this._pendingOpp,
      };
      if (!invalidAuth) {
      this.oppConnected();
      }
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
      if (!invalidAuth) {
        subscribeEntities(conn, (states) => this._updateOpp({ states }));
        subscribeConfig(conn, (config) => this._updateOpp({ config }));
        subscribeServices(conn, (services) => this._updateOpp({ services }));
        subscribePanels(conn, (panels) => this._updateOpp({ panels }));
      }
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
