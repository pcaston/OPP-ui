import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-input/paper-textarea";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../components/op-card";
import "../../components/op-menu-button";
import "../../resources/op-style";
import "../../util/app-localstorage-document";

class OpPanelDevMqtt extends PolymerElement {
  static get template() {
    return html`
      <style include="op-style">
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
        }

        .content {
          padding: 24px 0 32px;
          max-width: 600px;
          margin: 0 auto;
          direction: ltr;
        }

        mwc-button {
          background-color: white;
        }
      </style>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button></op-menu-button>
            <div main-title>MQTT</div>
          </app-toolbar>
        </app-header>

        <app-localstorage-document key="panel-dev-mqtt-topic" data="{{topic}}">
        </app-localstorage-document>
        <app-localstorage-document
          key="panel-dev-mqtt-payload"
          data="{{payload}}"
        >
        </app-localstorage-document>

        <div class="content">
          <op-card header="Publish a packet">
            <div class="card-content">
              <paper-input label="topic" value="{{topic}}"></paper-input>

              <paper-textarea
                always-float-label
                label="Payload (template allowed)"
                value="{{payload}}"
              ></paper-textarea>
            </div>
            <div class="card-actions">
              <mwc-button on-click="_publish">Publish</mwc-button>
            </div>
          </op-card>
        </div>
      </app-header-layout>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      topic: String,
      payload: String,
    };
  }

  _publish() {
    this.opp.callService("mqtt", "publish", {
      topic: this.topic,
      payload_template: this.payload,
    });
  }
}

customElements.define("op-panel-dev-mqtt", OpPanelDevMqtt);
