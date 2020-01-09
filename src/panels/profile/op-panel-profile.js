var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import "@material/mwc-button";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "../../components/op-card";
import "../../components/op-menu-button";
import "../../resources/op-style";
import "./op-change-password-card";
import "./op-mfa-modules-card";
import "./op-advanced-mode-card";
import "./op-refresh-tokens-card";
import "./op-long-lived-access-tokens-card";
import "./op-pick-language-row";
import "./op-pick-theme-row";
import "./op-push-notifications-row";
import "./op-force-narrow-row";
import "./op-set-vibrate-row";
import { LitElement, html, css, property, } from "lit-element";
import { opStyle } from "../../resources/styles";
import { fireEvent } from "../../common/dom/fire_event";
class OpPanelProfile extends LitElement {
    connectedCallback() {
        super.connectedCallback();
        this._refreshRefreshTokens();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubCoreData) {
            this._unsubCoreData();
            this._unsubCoreData = undefined;
        }
    }
    render() {
        return html `
      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button
              .opp=${this.opp}
              .narrow=${this.narrow}
            ></op-menu-button>
            <div main-title>${this.opp.localize("panel.profile")}</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <op-card .header=${this.opp.user.name}>
            <div class="card-content">
              ${this.opp.localize("ui.panel.profile.current_user", "fullName", this.opp.user.name)}
              ${this.opp.user.is_owner
            ? this.opp.localize("ui.panel.profile.is_owner")
            : ""}
            </div>

            <op-pick-language-row
              .narrow=${this.narrow}
              .opp=${this.opp}
            ></op-pick-language-row>
            <op-pick-theme-row
              .narrow=${this.narrow}
              .opp=${this.opp}
            ></op-pick-theme-row>
            ${this.opp.dockedSidebar !== "auto" || !this.narrow
            ? html `
                  <op-force-narrow-row
                    .narrow=${this.narrow}
                    .opp=${this.opp}
                  ></op-force-narrow-row>
                `
            : ""}
            ${navigator.vibrate
            ? html `
                  <op-set-vibrate-row
                    .narrow=${this.narrow}
                    .opp=${this.opp}
                  ></op-set-vibrate-row>
                `
            : ""}
            <op-push-notifications-row
              .narrow=${this.narrow}
              .opp=${this.opp}
            ></op-push-notifications-row>

            <div class="card-actions">
              <mwc-button class="warning" @click=${this._handleLogOut}>
                ${this.opp.localize("ui.panel.profile.logout")}
              </mwc-button>
            </div>
          </op-card>

          ${this.opp.user.credentials.some((cred) => cred.auth_provider_type === "openpeerpower")
            ? html `
                <op-change-password-card
                  .opp=${this.opp}
                ></op-change-password-card>
              `
            : ""}

          ${this.opp.user.is_admin
            ? html `
                <op-advanced-mode-card
                  .opp=${this.opp}
                ></op-advanced-mode-card>
              `
            : ""}

          <op-refresh-tokens-card
            .opp=${this.opp}
            .refreshTokens=${this._refreshTokens}
            @opp-refresh-tokens=${this._refreshRefreshTokens}
          ></op-refresh-tokens-card>

          <op-long-lived-access-tokens-card
            .opp=${this.opp}
            .refreshTokens=${this._refreshTokens}
            @opp-refresh-tokens=${this._refreshRefreshTokens}
          ></op-long-lived-access-tokens-card>
        </div>
      </app-header-layout>
    `;
    }
    async _refreshRefreshTokens() {
        this._refreshTokens = await this.opp.callWS({
            type: "auth/refresh_tokens",
        });
    }
    _handleLogOut() {
        fireEvent(this, "opp-logout");
    }
    static get styles() {
        return [
            opStyle,
            css `
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
        }

        .content {
          display: block;
          max-width: 600px;
          margin: 0 auto;
        }

        .content > * {
          display: block;
          margin: 24px 0;
        }

        .promo-advanced {
          text-align: center;
          color: var(--secondary-text-color);
        }
      `,
        ];
    }
}
__decorate([
    property()
], OpPanelProfile.prototype, "opp", void 0);
__decorate([
    property()
], OpPanelProfile.prototype, "narrow", void 0);
__decorate([
    property()
], OpPanelProfile.prototype, "_refreshTokens", void 0);
customElements.define("op-panel-profile", OpPanelProfile);
//# sourceMappingURL=op-panel-profile.js.map