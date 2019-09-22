import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../cards/opp-history_graph-card";
import "../../../components/opp-attributes";

class MoreInfoHistoryGraph extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          margin-bottom: 6px;
        }
      </style>
      <opp-history_graph-card
        hass="[[hass]]"
        state-obj="[[stateObj]]"
        in-dialog=""
      >
        <opp-attributes state-obj="[[stateObj]]"></opp-attributes>
      </opp-history_graph-card>
    `;
  }

  static get properties() {
    return {
      hass: Object,
      stateObj: Object,
    };
  }
}
customElements.define("more-info-history_graph", MoreInfoHistoryGraph);
