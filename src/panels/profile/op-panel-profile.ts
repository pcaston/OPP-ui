import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/paper-card/paper-card";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import "@material/mwc-button";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../components/op-menu-button";
import "../../resources/op-style";
import { EventsMixin } from "../../mixins/events-mixin";

import "./op-change-password-card";
import "./op-mfa-modules-card";
import "./op-refresh-tokens-card";
import "./op-long-lived-access-tokens-card";

import "./op-pick-language-row";
import "./op-pick-theme-row";
import "./op-push-notifications-row";

/*
 * @appliesMixin EventsMixin
 */
class HaPanelProfile extends EventsMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="op-style">
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
      </style>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button></op-menu-button>
            <div main-title>[['panel.profile']]</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <paper-card heading="[[opp.user.name]]">
            <div class="card-content">
              [['ui.panel.profile.current_user', 'fullName',
              opp.user.name]]
              <template is="dom-if" if="[[opp.user.is_owner]]"
                >[['ui.panel.profile.is_owner']]</template
              >
            </div>

            <hello-world opp="[[opp]]"></hello-world>

            <op-pick-language-row
              narrow="[[narrow]]"
              opp="[[opp]]"
            ></op-pick-language-row>
            <op-pick-theme-row
              narrow="[[narrow]]"
              opp="[[opp]]"
            ></op-pick-theme-row>
            <op-push-notifications-row
              narrow="[[narrow]]"
              opp="[[opp]]"
            ></op-push-notifications-row>

            <div class="card-actions">
              <mwc-button class="warning" on-click="_handleLogOut"
                >[['ui.panel.profile.logout']]</mwc-button
              >
            </div>
          </paper-card>

          <template is="dom-if" if="[[_canChangePassword(opp.user)]]">
            <op-change-password-card opp="[[opp]]"></op-change-password-card>
          </template>

          <op-mfa-modules-card
            opp="[[opp]]"
            mfa-modules="[[opp.user.mfa_modules]]"
          ></op-mfa-modules-card>

          <op-refresh-tokens-card
            opp="[[opp]]"
            refresh-tokens="[[_refreshTokens]]"
            on-opp-refresh-tokens="_refreshRefreshTokens"
          ></op-refresh-tokens-card>

          <op-long-lived-access-tokens-card
            opp="[[opp]]"
            refresh-tokens="[[_refreshTokens]]"
            on-opp-refresh-tokens="_refreshRefreshTokens"
          ></op-long-lived-access-tokens-card>
        </div>
      </app-header-layout>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      narrow: Boolean,
      _refreshTokens: Array,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._refreshRefreshTokens();
  }

  async _refreshRefreshTokens() {
    this._refreshTokens = await this.opp.callWS({
      type: "auth/refresh_tokens",
    });
  }

  _handleLogOut() {
    this.fire("opp-logout");
  }

  _canChangePassword(user) {
    return user.credentials.some(
      (cred) => cred.auth_provider_type === "openPeerPower"
    );
  }
}

customElements.define("op-panel-profile", HaPanelProfile);
