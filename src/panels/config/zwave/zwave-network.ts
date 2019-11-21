import "@polymer/paper-card/paper-card";
import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/buttons/op-call-api-button";
import "../../../components/buttons/op-call-service-button";
import "../../../components/op-service-description";
import "../op-config-section";

class ZwaveNetwork extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        .content {
          margin-top: 24px;
        }

        paper-card {
          display: block;
          margin: 0 auto;
          max-width: 600px;
        }

        .card-actions.warning op-call-service-button {
          color: var(--google-red-500);
        }

        .toggle-help-icon {
          position: absolute;
          top: -6px;
          right: 0;
          color: var(--primary-color);
        }

        op-service-description {
          display: block;
          color: grey;
        }

        [hidden] {
          display: none;
        }
      </style>
      <op-config-section is-wide="[[isWide]]">
        <div style="position: relative" slot="header">
          <span>Z-Wave Network Management</span>
          <paper-icon-button
            class="toggle-help-icon"
            on-click="helpTap"
            icon="opp:help-circle"
          ></paper-icon-button>
        </div>
        <span slot="introduction">
          Run commands that affect the Z-Wave network. You won't get feedback on
          whether the command succeeded, but you can look in the OZW Log to try
          to figure out.
        </span>

        <paper-card class="content">
          <div class="card-actions">
            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="add_node_secure"
            >
              Add Node Secure
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="add_node_secure"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="add_node"
            >
              Add Node
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="add_node"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="remove_node"
            >
              Remove Node
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="remove_node"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>
          </div>
          <div class="card-actions warning">
            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="cancel_command"
            >
              Cancel Command
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="cancel_command"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>
          </div>
          <div class="card-actions">
            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="heal_network"
            >
              Heal Network
            </op-call-service-button>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="start_network"
            >
              Start Network
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="start_network"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="stop_network"
            >
              Stop Network
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="stop_network"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="soft_reset"
            >
              Soft Reset
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="soft_reset"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-service-button
              opp="[[opp]]"
              domain="zwave"
              service="test_network"
            >
              Test Network
            </op-call-service-button>
            <op-service-description
              opp="[[opp]]"
              domain="zwave"
              service="test_network"
              hidden$="[[!showDescription]]"
            >
            </op-service-description>

            <op-call-api-button opp="[[opp]]" path="zwave/saveconfig">
              Save Config
            </op-call-api-button>
          </div>
        </paper-card>
      </op-config-section>
    `;
  }

  static get properties() {
    return {
      opp: Object,

      isWide: {
        type: Boolean,
        value: false,
      },

      showDescription: {
        type: Boolean,
        value: false,
      },
    };
  }

  helpTap() {
    this.showDescription = !this.showDescription;
  }
}

customElements.define("zwave-network", ZwaveNetwork);
