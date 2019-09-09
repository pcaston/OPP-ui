import {
    LitElement,
    html,
    customElement,
    property,
} from "lit-element";
  
import "../components/entity/opp-state-label-badge"
import { OpenPeerPower } from '../types';
import "@polymer/paper-card/paper-card";
import "@material/mwc-button";
import { enableWrite, saveTokens } from "../common/auth/token_storage";
import "../resources/op-style";
import { AuthData } from "../open-peer-power-js-websocket/lib";
  
@customElement("opp-store-auth-card")
  
export class OppStoreAuth extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public access_token!: AuthData;

  //static get template() {
  render(){
    return html`
      <style include="op-style">
          paper-card {
            position: fixed;
            padding: 8px 0;
            bottom: 16px;
            right: 16px;
          }
  
          .card-content {
            color: var(--primary-text-color);
          }
  
          .card-actions {
            text-align: right;
            border-top: 0;
            margin-right: -4px;
          }
  
          :host(.small) paper-card {
            bottom: 0;
            left: 0;
            right: 0;
          }
        </style>
        <paper-card elevation="4">
          <div class="card-content">Do you want to save this login?</div>
          <div class="card-actions">
            <mwc-button @click=${this._done }>No thanks</mwc-button>
            <mwc-button raised @click=${this._save}>Save login</mwc-button>
          </div>
        </paper-card>
      `;
  }

  firstUpdated() {
    super.firstUpdated;
    this.classList.toggle("small", window.innerWidth < 600);
  }

  private _save(event: Event) {
    console.log(event.target);
    debugger;
    enableWrite();
    saveTokens(this.access_token);
    this._done();
  }

  private _done() {
    const card = this.shadowRoot!.querySelector("paper-card");
    card!.style.transition = "bottom .25s";
    card!.style.bottom = `-${card!.offsetHeight + 8}px`;
    setTimeout(() => this.parentNode!.removeChild(this), 300);
  }
}