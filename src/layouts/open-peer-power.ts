import { html, customElement, property} from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from '../components/shared-styles';
// From Original.
import "../../node_modules/@polymer/app-route/app-location";

import "../layouts/open-peer-power-main";
import "../layouts/op-init-page";
import "../resources/op-style";
import { registerServiceWorker } from "../util/register-service-worker";

import { Route } from "../types";
import { OppElement } from "../state/opp-element";

@customElement('open-peer-power')

export class OpenPeerPowerAppEl extends OppElement {
  @property() private _route?: Route;
  @property() private _error?: boolean;

  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    const opp = this.opp;
    return html`
      <app-location
        @route-changed=${this._routeChanged}
      ></app-location>

      ${opp && opp.states && opp.config && opp.services
        ? html`
        <open-peer-power-main
          .opp=${this.opp}
          .route=${this._route}
        ></open-peer-power-main>
        `
        : html`
        <op-init-page .error=${this._error}></op-init-page>
      `}
    `;
  }
  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._initialize();
    setTimeout(registerServiceWorker, 1000);
  }

  protected async _initialize() {
    try {
      debugger;
      const { auth, conn } = await window.oppConnection;
      this.initializeOpp(auth, conn);
    } catch (err) {
      this._error = true;
      return;
    }
  }
}
