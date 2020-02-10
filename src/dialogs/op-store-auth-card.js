var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, } from "lit-element";
import "../components/entity/op-state-label-badge";
import "@polymer/paper-card/paper-card";
import "@material/mwc-button";
import { saveTokens } from "../common/auth/token_storage";
import { litLocalizeLiteMixin } from "../mixins/lit-localize-lite-mixin";
import "../resources/op-style";
let OppStoreAuth = class OppStoreAuth extends litLocalizeLiteMixin(LitElement) {
    render() {
        debugger;
        return html `
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
    _save(event) {
        console.log(event.target);
        saveTokens(this.access_token);
        this._done();
    }
    _done() {
        const card = this.shadowRoot.querySelector("paper-card");
        card.style.transition = "bottom .25s";
        card.style.bottom = `-${card.offsetHeight + 8}px`;
        setTimeout(() => this.parentNode.removeChild(this), 300);
    }
};
__decorate([
    property()
], OppStoreAuth.prototype, "opp", void 0);
__decorate([
    property()
], OppStoreAuth.prototype, "access_token", void 0);
OppStoreAuth = __decorate([
    customElement("op-store-auth-card")
], OppStoreAuth);
export { OppStoreAuth };
//# sourceMappingURL=op-store-auth-card.js.map