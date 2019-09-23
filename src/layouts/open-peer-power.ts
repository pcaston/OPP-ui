import { html, customElement, property} from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from '../components/shared-styles';
// From Original.
import "../layouts/open-peer-power-main";
import "../layouts/op-init-page";
import "../resources/op-style";
import { registerServiceWorker } from "../util/register-service-worker";

import { OppElement } from "../state/opp-element";

@customElement('open-peer-power')

export class OpenPeerPowerAppEl extends OppElement {
  @property() private _error?: boolean;

  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    const opp = this.opp;
    return html`
      ${opp && opp.states
        ? html`
        <open-peer-power-main
          opp=${this.opp}
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
      const { auth, conn } = await window.oppConnection;
      this.initializeOpp(auth, conn);
    } catch (err) {
      this._error = true;
      return;
    }
  }
}
