import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@material/mwc-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../components/entity/state-info";

/*
 * @appliesMixin LocalizeMixin
 */
class StateCardScene extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment"></style>
      <style>
        mwc-button {
          top: 3px;
          height: 37px;
          margin-right: -0.57em;
        }
      </style>

      <div class="horizontal justified layout">
        ${this.stateInfoTemplate}
        <mwc-button on-click="activateScene"
          >[[localize('ui.card.scene.activate')]]</mwc-button
        >
      </div>
    `;
  }

  static get stateInfoTemplate() {
    return html`
      <state-info
        opp="[[opp]]"
        state-obj="[[stateObj]]"
        in-dialog="[[inDialog]]"
      ></state-info>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      stateObj: Object,
      inDialog: {
        type: Boolean,
        value: false,
      },
    };
  }

  activateScene(ev) {
    ev.stopPropagation();
    this.opp.callService("scene", "turn_on", {
      entity_id: this.stateObj.entity_id,
    });
  }
}
customElements.define("state-card-scene", StateCardScene);
