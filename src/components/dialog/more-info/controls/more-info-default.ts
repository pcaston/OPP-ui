import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/opp-attributes";

class MoreInfoDefault extends PolymerElement {
  static get template() {
    return html`
      <opp-attributes state-obj="[[stateObj]]"></opp-attributes>
    `;
  }

  static get properties() {
    return {
      stateObj: {
        type: Object,
      },
    };
  }
}

customElements.define("more-info-default", MoreInfoDefault);
