import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-attributes";

class MoreInfoDefault extends PolymerElement {
  static get template() {
    return html`
      <op-attributes state-obj="[[stateObj]]"></op-attributes>
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
