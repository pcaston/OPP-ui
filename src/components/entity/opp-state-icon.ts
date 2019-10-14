import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../opp-icon";
import stateIcon from "../../common/entity/state_icon";

class OppStateIcon extends PolymerElement {
  static get template() {
    return html`
      <opp-icon icon="[[computeIcon(stateObj)]]"></opp-icon>
    `;
  }

  static get properties() {
    return {
      stateObj: {
        type: Object,
      },
    };
  }

  computeIcon(stateObj) {
    return stateIcon(stateObj);
  }
}

customElements.define("opp-state-icon", OppStateIcon);
