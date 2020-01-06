import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@material/mwc-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-input/paper-textarea";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../components/op-menu-button";
import "../../resources/op-style";
import "./events-list";
import "./event-subscribe-card";
import { EventsMixin } from "../../mixins/events-mixin";

/*
 * @appliesMixin EventsMixin
 */
class OpPanelDevEvent extends EventsMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="op-style iron-flex iron-positioning"></style>
      <style>
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
        }

        .content {
          @apply --paper-font-body1;
          padding: 16px;
          direction: ltr;
        }

        .op-form {
          margin-right: 16px;
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

      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button></op-menu-button>
            <div main-title>Events</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <div class$="[[computeFormClasses(narrow)]]">
            <div class="flex">
              <p>Fire an event on the event bus.</p>

              <div class="op-form">
                <paper-input
                  label="Event Type"
                  autofocus
                  required
                  value="{{eventType}}"
                ></paper-input>
                <paper-textarea
                  label="Event Data (JSON, optional)"
                  value="{{eventData}}"
                ></paper-textarea>
                <mwc-button on-click="fireEvent" raised>Fire Event</mwc-button>
              </div>
            </div>

            <div>
              <div class="header">Available Events</div>
              <events-list
                on-event-selected="eventSelected"
                opp="[[opp]]"
              ></events-list>
            </div>
          </div>
          <event-subscribe-card opp="[[opp]]"></event-subscribe-card>
        </div>
      </app-header-layout>
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
    };
  }

  eventSelected(ev) {
    this.eventType = ev.detail.eventType;
  }

  fireEvent() {
    var eventData;

    try {
      eventData = this.eventData ? JSON.parse(this.eventData) : {};
    } catch (err) {
      /* eslint-disable no-alert */
      alert("Error parsing JSON: " + err);
      /* eslint-enable no-alert */
      return;
    }

    this.opp.callApi("POST", "events/" + this.eventType, eventData).then(
      function() {
        this.fire("opp-notification", {
          message: "Event " + this.eventType + " successful fired!",
        });
      }.bind(this)
    );
  }

  computeFormClasses(narrow) {
    return narrow ? "" : "layout horizontal";
  }
}

customElements.define("op-panel-dev-event", OpPanelDevEvent);
