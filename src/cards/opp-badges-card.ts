import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../components/entity/opp-state-label-badge";

class OppBadgesCard extends PolymerElement {
  static get template() {
    return html`
      <style>
        opp-state-label-badge {
          display: inline-block;
          margin-bottom: var(--opp-state-label-badge-margin-bottom, 16px);
        }
      </style>
      <template is="dom-repeat" items="[[states]]">
        <opp-state-label-badge
          opp="[[opp]]"
          state="[[item]]"
        ></opp-state-label-badge>
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
customElements.define("opp-badges-card", OppBadgesCard);
