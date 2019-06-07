import "@polymer/app-route/app-location";
import { html, LitElement, PropertyValues, css, property } from "lit-element";

import "./open-peer-power-main";
import "./op-init-page";
import "../resources/op-style";
import { registerServiceWorker } from "../util/register-service-worker";
import { DEFAULT_PANEL } from "../common/const";

import { Route, OpenPeerPower } from "../types";
import { navigate } from "../common/navigate";
import { OppElement } from "../state/opp-element";

(LitElement.prototype as any).html = html;
(LitElement.prototype as any).css = css;

export class OpenPeerPowerAppEl extends OppElement {
  @property() private _route?: Route;
  @property() private _error?: boolean;
  @property() private _panelUrl?: string;

  protected render() {
    const opp = this.opp;

    return html`
      <app-location
        @route-changed=${this._routeChanged}
        ?use-hash-as-path=${__DEMO__}
      ></app-location>
      ${this._panelUrl === undefined || this._route === undefined
        ? ""
        : opp && opp.states && opp.config && opp.services
        ? html`
            <script>console.log("open-peer-power-main");</script>
            <open-peer-power-main
              .opp=${this.opp}
              .route=${this._route}
            ></open-peer-power-main>
          `
        : html`
            <script>console.log("op-init-page");</script>
            <op-init-page .error=${this._error}></op-init-page>
          `}
    `;
  }

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._initialize();
    setTimeout(registerServiceWorker, 1000);
    /* polyfill for paper-dropdown */
    import(/* webpackChunkName: "polyfill-web-animations-next" */ "web-animations-js/web-animations-next-lite.min");
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has("_panelUrl")) {
      this.panelUrlChanged(this._panelUrl!);
      this._updateOpp({ panelUrl: this._panelUrl });
    }
    if (changedProps.has("opp")) {
      this.oppChanged(this.opp!, changedProps.get("opp") as
        | OpenPeerPower
        | undefined);
    }
  }

  protected async _initialize() {
    try {
      const { auth, conn } = await window.oppConnection;
      this.initializeOpp(auth, conn);
    } catch (err) {
      this._error = true;
      return;
    }
  }

  private _routeChanged(ev) {
    const route = ev.detail.value as Route;
    // If it's the first route that we process,
    // check if we should navigate away from /
    if (
      this._route === undefined &&
      (route.path === "" || route.path === "/")
    ) {
      navigate(window, `/${localStorage.defaultPage || DEFAULT_PANEL}`, true);
      return;
    }

    this._route = route;

    const dividerPos = route.path.indexOf("/", 1);
    this._panelUrl =
      dividerPos === -1
        ? route.path.substr(1)
        : route.path.substr(1, dividerPos - 1);
  }
}

customElements.define("open-peer-power", OpenPeerPowerAppEl);
