import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/buttons/op-call-service-button";
import "../../../resources/op-style";

import "../op-config-section";

import isComponentLoaded from "../../../common/config/is_component_loaded";
import LocalizeMixin from "../../../mixins/localize-mixin";

import "./op-config-name-form";
import "./op-config-core-form";

/*
 * @appliesMixin LocalizeMixin
 */
class OpConfigSectionCore extends LocalizeMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        .validate-container {
          @apply --layout-vertical;
          @apply --layout-center-center;
          height: 140px;
        }

        .validate-result {
          color: var(--google-green-500);
          font-weight: 500;
          margin-bottom: 1em;
        }

        .config-invalid {
          margin: 1em 0;
        }

        .config-invalid .text {
          color: var(--google-red-500);
          font-weight: 500;
        }

        .config-invalid mwc-button {
          float: right;
        }

        .validate-log {
          white-space: pre-wrap;
          direction: ltr;
        }
      </style>
      <op-config-section is-wide="[[isWide]]">
        <span slot="header"
          >[[localize('ui.panel.config.core.section.core.header')]]</span
        >
        <span slot="introduction"
          >[[localize('ui.panel.config.core.section.core.introduction')]]</span
        >

        <op-config-name-form opp="[[opp]]"></op-config-name-form>
        <op-config-core-form opp="[[opp]]"></op-config-core-form>

        <op-card
          header="[[localize('ui.panel.config.core.section.core.validation.heading')]]"
        >
          <div class="card-content">
            [[localize('ui.panel.config.core.section.core.validation.introduction')]]
            <template is="dom-if" if="[[!validateLog]]">
              <div class="validate-container">
                <template is="dom-if" if="[[!validating]]">
                  <template is="dom-if" if="[[isValid]]">
                    <div class="validate-result" id="result">
                      [[localize('ui.panel.config.core.section.core.validation.valid')]]
                    </div>
                  </template>
                  <mwc-button raised="" on-click="validateConfig">
                    [[localize('ui.panel.config.core.section.core.validation.check_config')]]
                  </mwc-button>
                </template>
                <template is="dom-if" if="[[validating]]">
                  <paper-spinner active=""></paper-spinner>
                </template>
              </div>
            </template>
            <template is="dom-if" if="[[validateLog]]">
              <div class="config-invalid">
                <span class="text">
                  [[localize('ui.panel.config.core.section.core.validation.invalid')]]
                </span>
                <mwc-button raised="" on-click="validateConfig">
                  [[localize('ui.panel.config.core.section.core.validation.check_config')]]
                </mwc-button>
              </div>
              <div id="configLog" class="validate-log">[[validateLog]]</div>
            </template>
          </div>
        </op-card>

        <op-card
          header="[[localize('ui.panel.config.core.section.core.reloading.heading')]]"
        >
          <div class="card-content">
            [[localize('ui.panel.config.core.section.core.reloading.introduction')]]
          </div>
          <div class="card-actions">
            <op-call-service-button
              opp="[[opp]]"
              domain="openpeerpower"
              service="reload_core_config"
              >[[localize('ui.panel.config.core.section.core.reloading.core')]]
            </op-call-service-button>
            <op-call-service-button
              opp="[[opp]]"
              domain="group"
              service="reload"
              hidden$="[[!groupLoaded(opp)]]"
              >[[localize('ui.panel.config.core.section.core.reloading.group')]]
            </op-call-service-button>
            <op-call-service-button
              opp="[[opp]]"
              domain="automation"
              service="reload"
              hidden$="[[!automationLoaded(opp)]]"
              >[[localize('ui.panel.config.core.section.core.reloading.automation')]]
            </op-call-service-button>
            <op-call-service-button
              opp="[[opp]]"
              domain="script"
              service="reload"
              hidden$="[[!scriptLoaded(opp)]]"
              >[[localize('ui.panel.config.core.section.core.reloading.script')]]
            </op-call-service-button>
          </div>
        </op-card>

        <op-card
          header="[[localize('ui.panel.config.core.section.core.server_management.heading')]]"
        >
          <div class="card-content">
            [[localize('ui.panel.config.core.section.core.server_management.introduction')]]
          </div>
          <div class="card-actions warning">
            <op-call-service-button
              class="warning"
              opp="[[opp]]"
              domain="openpeerpower"
              service="restart"
              >[[localize('ui.panel.config.core.section.core.server_management.restart')]]
            </op-call-service-button>
            <op-call-service-button
              class="warning"
              opp="[[opp]]"
              domain="openpeerpower"
              service="stop"
              >[[localize('ui.panel.config.core.section.core.server_management.stop')]]
            </op-call-service-button>
          </div>
        </op-card>
      </op-config-section>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },

      isWide: {
        type: Boolean,
        value: false,
      },

      validating: {
        type: Boolean,
        value: false,
      },

      isValid: {
        type: Boolean,
        value: null,
      },

      validateLog: {
        type: String,
        value: "",
      },
    };
  }

  groupLoaded(opp) {
    return isComponentLoaded(opp, "group");
  }

  automationLoaded(opp) {
    return isComponentLoaded(opp, "automation");
  }

  scriptLoaded(opp) {
    return isComponentLoaded(opp, "script");
  }

  validateConfig() {
    this.validating = true;
    this.validateLog = "";
    this.isValid = null;

    this.opp.callApi("POST", "config/core/check_config").then((result) => {
      this.validating = false;
      this.isValid = result.result === "valid";

      if (!this.isValid) {
        this.validateLog = result.errors;
      }
    });
  }
}

customElements.define("op-config-section-core", OpConfigSectionCore);
