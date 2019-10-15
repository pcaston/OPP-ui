import { html, customElement, property} from 'lit-element';


// These are the shared styles needed by this element.
import { SharedStyles } from '../components/shared-styles';
// From Original.
import "../layouts/open-peer-power-main";
import "../layouts/op-init-page";
import "../resources/op-style";

import { OppElement } from "../state/opp-element";
import { OpenPeerPower } from "../types";
import { OppEntities } from "../open-peer-power-js-websocket/lib";
import { Appliances } from '../components/appliance-list';

@customElement('open-peer-power')

export class OpenPeerPowerAppEl extends OppElement {
  @property() private _error?: boolean;
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states!: OppEntities;
  @property({ type : Array }) appliances: Appliances = {};

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
        <opp-home-view 
          appliances="${JSON.stringify(this.appliances)}" 
          opp="${JSON.stringify(this.opp)}" class="page"
          active
          >
        </opp-home-view>
        `
        : html`
        <op-init-page .error=${this._error}></op-init-page>
      `}
    `;
  }
}
