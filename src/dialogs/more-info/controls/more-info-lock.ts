import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-attributes";

/*
 */
class MoreInfoLock extends PolymerElement {
  static get template() {
    return html`
      <style>
        paper-input {
          display: inline-block;
        }
      </style>

      <template is="dom-if" if="[[stateObj.attributes.code_format]]">
        <paper-input
          label="[['ui.card.lock.code']]"
          value="{{enteredCode}}"
          pattern="[[stateObj.attributes.code_format]]"
          type="password"
        ></paper-input>
        <mwc-button
          on-click="callService"
          data-service="unlock"
          hidden$="[[!isLocked]]"
          >[['ui.card.lock.unlock']]</mwc-button
        >
        <mwc-button
          on-click="callService"
          data-service="lock"
          hidden$="[[isLocked]]"
          >[['ui.card.lock.lock']]</mwc-button
        >
      </template>
      <op-attributes
        state-obj="[[stateObj]]"
        extra-filters="code_format"
      ></op-attributes>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      stateObj: {
        type: Object,
        observer: "stateObjChanged",
      },
      enteredCode: {
        type: String,
        value: "",
      },
      isLocked: Boolean,
    };
  }

  stateObjChanged(newVal) {
    if (newVal) {
      this.isLocked = newVal.state === "locked";
    }
  }

  callService(ev) {
    const service = ev.target.getAttribute("data-service");
    const data = {
      entity_id: this.stateObj.entity_id,
      code: this.enteredCode,
    };
    this.opp.callService("lock", service, data);
  }
}

customElements.define("more-info-lock", MoreInfoLock);
