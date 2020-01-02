import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "./op-progress-button";
import { EventsMixin } from "../../mixins/events-mixin";

/*
 * @appliesMixin EventsMixin
 */
class OpCallServiceButton extends EventsMixin(PolymerElement) {
  static get template() {
    return html`
      <op-progress-button
        id="progress"
        progress="[[progress]]"
        on-click="buttonTapped"
        ><slot></slot
      ></op-progress-button>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },

      progress: {
        type: Boolean,
        value: false,
      },

      domain: {
        type: String,
      },

      service: {
        type: String,
      },

      serviceData: {
        type: Object,
        value: {},
      },
    };
  }

  buttonTapped() {
    this.progress = true;
    var el = this;
    var eventData = {
      domain: this.domain,
      service: this.service,
      serviceData: this.serviceData,
    };

    this.opp
      .callService(this.domain, this.service, this.serviceData)
      .then(
        function() {
          el.progress = false;
          el.$.progress.actionSuccess();
          eventData.success = true;
        },
        function() {
          el.progress = false;
          el.$.progress.actionError();
          eventData.success = false;
        }
      )
      .then(function() {
        el.fire("opp-service-called", eventData);
      });
  }
}

customElements.define("op-call-service-button", OpCallServiceButton);
