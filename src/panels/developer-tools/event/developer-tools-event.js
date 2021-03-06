import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import { safeLoad } from "js-yaml";

import "../../../components/op-code-editor";
import "../../../resources/op-style";
import "./events-list";
import "./event-subscribe-card";
import { EventsMixin } from "../../../mixins/events-mixin";
import LocalizeMixin from "../../../mixins/localize-mixin";
import { showAlertDialog } from "../../../dialogs/generic/show-dialog-box";

const ERROR_SENTINEL = {};
/*
 * @appliesMixin EventsMixin
 * @appliesMixin LocalizeMixin
 */
class OpPanelDevEvent extends EventsMixin(LocalizeMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="op-style iron-flex iron-positioning"></style>
      <style>
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
          @apply --paper-font-body1;
          padding: 16px;
          direction: ltr;
          display: block;
        }

        .op-form {
          margin-right: 16px;
          max-width: 400px;
        }

        mwc-button {
          margin-top: 8px;
        }

        .header {
          @apply --paper-font-title;
        }

        event-subscribe-card {
          display: block;
          max-width: 800px;
          margin: 16px auto;
        }
      </style>

      <div class$="[[computeFormClasses(narrow)]]">
        <div class="flex">
          <p>
            [[localize( 'ui.panel.developer-tools.tabs.events.description' )]]
            <a
              href="https://www.open-peer-power.io/docs/configuration/events/"
              target="_blank"
              >[[localize( 'ui.panel.developer-tools.tabs.events.documentation'
              )]]</a
            >
          </p>
          <div class="op-form">
            <paper-input
              label="[[localize(
                'ui.panel.developer-tools.tabs.events.type'
              )]]"
              autofocus
              required
              value="{{eventType}}"
            ></paper-input>
            <p>
              [[localize( 'ui.panel.developer-tools.tabs.events.data' )]]
            </p>
            <op-code-editor
              mode="yaml"
              value="[[eventData]]"
              error="[[!validJSON]]"
              on-value-changed="_yamlChanged"
            ></op-code-editor>
            <mwc-button on-click="fireEvent" raised disabled="[[!validJSON]]"
              >[[localize( 'ui.panel.developer-tools.tabs.events.fire_event'
              )]]</mwc-button
            >
          </div>
        </div>

        <div>
          <div class="header">
            [[localize( 'ui.panel.developer-tools.tabs.events.available_events'
            )]]
          </div>
          <events-list
            on-event-selected="eventSelected"
            opp="[[opp]]"
          ></events-list>
        </div>
      </div>
      <event-subscribe-card opp="[[opp]]"></event-subscribe-card>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },

      eventType: {
        type: String,
        value: "",
      },

      eventData: {
        type: String,
        value: "",
      },

      parsedJSON: {
        type: Object,
        computed: "_computeParsedEventData(eventData)",
      },

      validJSON: {
        type: Boolean,
        computed: "_computeValidJSON(parsedJSON)",
      },
    };
  }

  eventSelected(ev) {
    this.eventType = ev.detail.eventType;
  }

  _computeParsedEventData(eventData) {
    try {
      return eventData.trim() ? safeLoad(eventData) : {};
    } catch (err) {
      return ERROR_SENTINEL;
    }
  }

  _computeValidJSON(parsedJSON) {
    return parsedJSON !== ERROR_SENTINEL;
  }

  _yamlChanged(ev) {
    this.eventData = ev.detail.value;
  }

  fireEvent() {
    if (!this.eventType) {
      showAlertDialog(this, {
        text: this.opp.localize(
          "ui.panel.developer-tools.tabs.events.alert_event_type"
        ),
      });
      return;
    }
    this.opp.callApi("POST", "events/" + this.eventType, this.parsedJSON).then(
      function() {
        this.fire("opp-notification", {
          message: this.opp.localize(
            "ui.panel.developer-tools.tabs.events.notification_event_fired",
            "type",
            this.eventType
          ),
        });
      }.bind(this)
    );
  }

  computeFormClasses(narrow) {
    return narrow ? "" : "layout horizontal";
  }
}

customElements.define("developer-tools-event", OpPanelDevEvent);
