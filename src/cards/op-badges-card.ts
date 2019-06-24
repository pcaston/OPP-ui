import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../components/entity/op-state-label-badge";

class OpBadgesCard extends PolymerElement {
  static get template() {
    return html`
      <style>
        op-state-label-badge {
          display: inline-block;
          margin-bottom: var(--op-state-label-badge-margin-bottom, 16px);
        }
      </style>
      <template is="dom-repeat" items="[[states]]">
        <op-state-label-badge
          opp="[[opp]]"
          state="[[item]]"
        ></op-state-label-badge>
      </template>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      states: Array,
    };
  }
}
customElements.define("op-badges-card", OpBadgesCard);
