import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@polymer/paper-tooltip/paper-tooltip";
import "@material/mwc-button";
import "@polymer/paper-fab/paper-fab";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/entity/op-state-icon";
import "../../../layouts/opp-subpage";
import "../../../resources/op-style";
import "../../../components/op-icon-next";

import { computeRTL } from "../../../common/util/compute_rtl";
import "../op-config-section";
import { EventsMixin } from "../../../mixins/events-mixin";
import computeStateName from "../../../common/entity/compute_state_name";
import {
  loadConfigFlowDialog,
  showConfigFlowDialog,
} from "../../../dialogs/config-flow/show-dialog-config-flow";
import { localizeConfigFlowTitle } from "../../../data/config_entries";

/*
 * @appliesMixin EventsMixin
 */
class OpConfigManagerDashboard extends 
  EventsMixin(PolymerElement
) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        op-card {
          overflow: hidden;
        }
        mwc-button {
          top: 3px;
          margin-right: -0.57em;
        }
        .config-entry-row {
          display: flex;
          padding: 0 16px;
        }
        op-state-icon {
          cursor: pointer;
        }
        .configured a {
          color: var(--primary-text-color);
          text-decoration: none;
        }
        paper-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 1;
        }

        paper-fab[is-wide] {
          bottom: 24px;
          right: 24px;
        }

        paper-fab[rtl] {
          right: auto;
          left: 16px;
        }

        paper-fab[rtl][is-wide] {
          bottom: 24px;
          right: auto;
          left: 24px;
        }
      </style>

      <opp-subpage
        header="[['ui.panel.config.integrations.caption']]"
      >
        <template is="dom-if" if="[[progress.length]]">
          <op-config-section>
            <span slot="header"
              >[['ui.panel.config.integrations.discovered']]</span
            >
            <op-card>
              <template is="dom-repeat" items="[[progress]]">
                <div class="config-entry-row">
                  <paper-item-body>
                    [[_computeActiveFlowTitle(item)]]
                  </paper-item-body>
                  <mwc-button on-click="_continueFlow"
                    >[['ui.panel.config.integrations.configure']]</mwc-button
                  >
                </div>
              </template>
            </op-card>
          </op-config-section>
        </template>

        <op-config-section class="configured">
          <span slot="header"
            >[['ui.panel.config.integrations.configured']]</span
          >
          <op-card>
            <template is="dom-if" if="[[!entries.length]]">
              <div class="config-entry-row">
                <paper-item-body two-line>
                  <div>[['ui.panel.config.integrations.none']]</div>
                </paper-item-body>
              </div>
            </template>
            <template is="dom-repeat" items="[[entries]]">
              <a href="/config/integrations/[[item.entry_id]]">
                <paper-item>
                  <paper-item-body two-line>
                    <div>
                      [[_computeIntegrationTitle(item.domain)]]:
                      [[item.title]]
                    </div>
                    <div secondary>
                      <template
                        is="dom-repeat"
                        items="[[_computeConfigEntryEntities(opp, item, entities)]]"
                      >
                        <span>
                          <op-state-icon
                            state-obj="[[item]]"
                            on-click="_handleMoreInfo"
                          ></op-state-icon>
                          <paper-tooltip position="bottom"
                            >[[_computeStateName(item)]]</paper-tooltip
                          >
                        </span>
                      </template>
                    </div>
                  </paper-item-body>
                  <op-icon-next></op-icon-next>
                </paper-item>
              </a>
            </template>
          </op-card>
        </op-config-section>

        <paper-fab
          icon="opp:plus"
          title="[['ui.panel.config.integrations.new']]"
          on-click="_createFlow"
          is-wide$="[[isWide]]"
          rtl$="[[rtl]]"
        ></paper-fab>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,

      /**
       * Existing entries.
       */
      entries: Array,

      /**
       * Entity Registry entries.
       */
      entities: Array,

      /**
       * Current flows that are in progress and have not been started by a user.
       * For example, can be discovered devices that require more config.
       */
      progress: Array,

      handlers: Array,

      rtl: {
        type: Boolean,
        reflectToAttribute: true,
        computed: "_computeRTL(opp)",
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    loadConfigFlowDialog();
  }

  _createFlow() {
    showConfigFlowDialog(this, {
      dialogClosedCallback: () => this.fire("opp-reload-entries"),
    });
  }

  _continueFlow(ev) {
    showConfigFlowDialog(this, {
      continueFlowId: ev.model.item.flow_id,
      dialogClosedCallback: () => this.fire("opp-reload-entries"),
    });
  }

  _computeIntegrationTitle(integration) {
    return `component.${integration}.config.title`;
  }

  _computeActiveFlowTitle(flow) {
    return localizeConfigFlowTitle(flow);
  }

  _computeConfigEntryEntities(opp, configEntry, entities) {
    if (!entities) {
      return [];
    }
    const states = [];
    entities.forEach((entity) => {
      if (
        entity.config_entry_id === configEntry.entry_id &&
        entity.entity_id in opp.states
      ) {
        states.push(opp.states[entity.entity_id]);
      }
    });
    return states;
  }

  _computeStateName(stateObj) {
    return computeStateName(stateObj);
  }

  _handleMoreInfo(ev) {
    this.fire("opp-more-info", { entityId: ev.model.item.entity_id });
  }

  _computeRTL(opp) {
    return computeRTL(opp);
  }
}

customElements.define("op-config-entries-dashboard", OpConfigManagerDashboard);
