import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import CoverEntity from "../util/cover-model";

class OpCoverControls extends PolymerElement {
  static get template() {
    return html`
      <style>
        .state {
          white-space: nowrap;
        }
        [invisible] {
          visibility: hidden !important;
        }
      </style>

      <div class="state">
        <paper-icon-button
          aria-label="Open cover"
          icon="opp:arrow-up"
          on-click="onOpenTap"
          invisible$="[[!entityObj.supportsOpen]]"
          disabled="[[computeOpenDisabled(stateObj, entityObj)]]"
        ></paper-icon-button>
        <paper-icon-button
          aria-label="Stop the cover from moving"
          icon="opp:stop"
          on-click="onStopTap"
          invisible$="[[!entityObj.supportsStop]]"
        ></paper-icon-button>
        <paper-icon-button
          aria-label="Close cover"
          icon="opp:arrow-down"
          on-click="onCloseTap"
          invisible$="[[!entityObj.supportsClose]]"
          disabled="[[computeClosedDisabled(stateObj, entityObj)]]"
        ></paper-icon-button>
      </div>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },
      stateObj: {
        type: Object,
      },
      entityObj: {
        type: Object,
        computed: "computeEntityObj(opp, stateObj)",
      },
    };
  }

  computeEntityObj(opp, stateObj) {
    return new CoverEntity(opp, stateObj);
  }

  computeOpenDisabled(stateObj, entityObj) {
    var assumedState = stateObj.attributes.assumed_state === true;
    return (entityObj.isFullyOpen || entityObj.isOpening) && !assumedState;
  }

  computeClosedDisabled(stateObj, entityObj) {
    var assumedState = stateObj.attributes.assumed_state === true;
    return (entityObj.isFullyClosed || entityObj.isClosing) && !assumedState;
  }

  onOpenTap(ev) {
    ev.stopPropagation();
    this.entityObj.openCover();
  }

  onCloseTap(ev) {
    ev.stopPropagation();
    this.entityObj.closeCover();
  }

  onStopTap(ev) {
    ev.stopPropagation();
    this.entityObj.stopCover();
  }
}

customElements.define("op-cover-controls", OpCoverControls);
