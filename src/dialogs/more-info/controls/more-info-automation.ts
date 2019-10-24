import "@material/mwc-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-relative-time";

class MoreInfoAutomation extends PolymerElement {
  static get template() {
    return html`
      <style>
        .flex {
          display: flex;
          justify-content: space-between;
        }
        .actions {
          margin: 36px 0 8px 0;
          text-align: right;
        }
      </style>

      <div class="flex">
        <div>[[localize('ui.card.automation.last_triggered')]]:</div>
        <op-relative-time
          opp="[[opp]]"
          datetime="[[stateObj.attributes.last_triggered]]"
        ></op-relative-time>
      </div>

      <div class="actions">
        <mwc-button on-click="handleTriggerTapped">
          [[localize('ui.card.automation.trigger')]]
        </mwc-button>
      </div>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      stateObj: Object,
    };
  }

  handleTriggerTapped() {
    this.opp.callService("automation", "trigger", {
      entity_id: this.stateObj.entity_id,
    });
  }
}

customElements.define("more-info-automation", MoreInfoAutomation);
