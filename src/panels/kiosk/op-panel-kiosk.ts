import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../states/op-panel-states";

class HaPanelKiosk extends PolymerElement {
  static get template() {
    return html`
      <op-panel-states
        id="kiosk-states"
        opp="[[opp]]"
        show-menu
        route="[[route]]"
        panel-visible
      ></op-panel-states>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      route: Object,
    };
  }
}

customElements.define("op-panel-kiosk", HaPanelKiosk);
