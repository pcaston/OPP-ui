import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/op-menu-button";
import "../../../components/op-icon-next";

import "../op-config-section";
import "./op-config-navigation";

import isComponentLoaded from "../../../common/config/is_component_loaded";
import LocalizeMixin from "../../../mixins/localize-mixin";
import NavigateMixin from "../../../mixins/navigate-mixin";

/*
 * @appliesMixin LocalizeMixin
 */
class HaConfigDashboard extends NavigateMixin(LocalizeMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="iron-flex op-style">
      op-card {
        overflow: hidden;
      }
      .content {
        padding-bottom: 32px;
      }
      a {
        text-decoration: none;
        color: var(--primary-text-color);
      }
    </style>

    <app-header-layout has-scrolling-region="">
      <app-header slot="header" fixed="">
        <app-toolbar>
          <op-menu-button></op-menu-button>
          <div main-title="">[[localize('panel.config')]]</div>
        </app-toolbar>
      </app-header>

      <div class="content">
        <op-config-section is-wide="[[isWide]]">
          <span slot="header">[[localize('ui.panel.config.header')]]</span>
          <span slot="introduction">[[localize('ui.panel.config.introduction')]]</span>

          <template is="dom-if" if="[[computeIsLoaded(opp, 'cloud')]]">
            <op-card>
              <a href='/config/cloud' tabindex="-1">
                <paper-item>
                  <paper-item-body two-line="">
                    [[localize('ui.panel.config.cloud.caption')]]
                    <template is="dom-if" if="[[cloudStatus.logged_in]]">
                      <div secondary="">
                        [[localize('ui.panel.config.cloud.description_login', 'email', cloudStatus.email)]]
                      </div>
                    </template>
                    <template is="dom-if" if="[[!cloudStatus.logged_in]]">
                      <div secondary="">
                        [[localize('ui.panel.config.cloud.description_features')]]
                      </div>
                    </template>
                  </paper-item-body>
                  <op-icon-next></op-icon-next>
                </paper-item>
              </op-card>
            </a>
          </template>

          <op-card>
            <a href='/config/integrations/dashboard' tabindex="-1">
              <paper-item>
                <paper-item-body two-line>
                  [[localize('ui.panel.config.integrations.caption')]]
                  <div secondary>
                    [[localize('ui.panel.config.integrations.description')]]
                  </div>
                </paper-item-body>
                <op-icon-next></op-icon-next>
              </paper-item>
            </a>

            <a href='/config/users' tabindex="-1">
              <paper-item>
                <paper-item-body two-line>
                  [[localize('ui.panel.config.users.caption')]]
                  <div secondary>
                    [[localize('ui.panel.config.users.description')]]
                  </div>
                </paper-item-body>
                <op-icon-next></op-icon-next>
              </paper-item>
            </a>
          </op-card>

          <op-config-navigation opp="[[opp]]"></op-config-navigation>
        </op-config-section>
      </div>
    </app-header-layout>
`;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
      cloudStatus: Object,
    };
  }

  computeIsLoaded(opp, component) {
    return isComponentLoaded(opp, component);
  }
}

customElements.define("op-config-dashboard", HaConfigDashboard);
