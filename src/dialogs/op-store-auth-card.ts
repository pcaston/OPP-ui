import {
    LitElement,
    html,
    customElement,
    property,
} from "lit-element";
  
import "../components/entity/op-state-label-badge"
import { OpenPeerPower } from '../types';
import "@polymer/paper-card/paper-card";
import "@material/mwc-button";
import { litLocalizeLiteMixin } from "../mixins/lit-localize-lite-mixin";
import { enableWrite, saveTokens  } from "../common/auth/token_storage";

import "../resources/op-style";
import { Auth, AuthData } from "../websocket/lib";
  
@customElement("op-store-auth-card")
export class OppStoreAuth extends litLocalizeLiteMixin(LitElement) {
  @property() public opp?: OpenPeerPower;
  @property() public access_token!: Auth;
  @property() public data!: AuthData;

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
        <div class="card-content">${this.localize('ui.auth_store.ask')}</div>
        <div class="card-actions">
          <mwc-button @click="${this._done}"
            >${this.localize('ui.auth_store.decline')}</mwc-button
          >
          <mwc-button raised @click="${this._save}"
            >${this.localize('ui.auth_store.confirm')}</mwc-button
          >
        </div>
      </paper-card>
    `;
  }

  firstUpdated() {
    super.firstUpdated;
    this.classList.toggle("small", window.innerWidth < 600);
  }

  private _save() {
    enableWrite();
    saveTokens(this.opp!.auth.data);
    this._done();
  }

  private _done() {
    const card = this.shadowRoot!.querySelector("paper-card");
    card!.style.transition = "bottom .25s";
    card!.style.bottom = `-${card!.offsetHeight + 8}px`;
    setTimeout(() => this.parentNode!.removeChild(this), 300);
    const newLocation = `/`;
    window.location.pathname = newLocation;
  }
}
