import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-input/paper-textarea";
import "@polymer/paper-spinner/paper-spinner";
import { timeOut } from "@polymer/polymer/lib/utils/async";
import { Debouncer } from "@polymer/polymer/lib/utils/debounce";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../components/op-menu-button";
import "../../resources/op-style";

class OpPanelDevTemplate extends PolymerElement {
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
          padding: 16px;
          direction: ltr;
        }

        .edit-pane {
          margin-right: 16px;
        }

        .edit-pane a {
          color: var(--dark-primary-color);
        }

        .horizontal .edit-pane {
          max-width: 50%;
        }

        .render-pane {
          position: relative;
          max-width: 50%;
        }

        .render-spinner {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        paper-textarea {
          --paper-input-container-input: {
            @apply --paper-font-code1;
          }
        }

        .rendered {
          @apply --paper-font-code1;
          clear: both;
          white-space: pre-wrap;
        }

        .rendered.error {
          color: red;
        }
      </style>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button></op-menu-button>
            <div main-title>Templates</div>
          </app-toolbar>
        </app-header>

        <div class$="[[computeFormClasses(narrow)]]">
          <div class="edit-pane">
            <p>
              Templates are rendered using the Jinja2 template engine with some
              Open Peer Power specific extensions.
            </p>
            <ul>
              <li>
                <a
                  href="http://jinja.pocoo.org/docs/dev/templates/"
                  target="_blank"
                  >Jinja2 template documentation</a
                >
              </li>
              <li>
                <a
                  href="https://.io/docs/configuration/templating/"
                  target="_blank"
                  >Open Peer Power template extensions</a
                >
              </li>
            </ul>
            <paper-textarea
              label="Template editor"
              value="{{template}}"
              autofocus
            ></paper-textarea>
          </div>

          <div class="render-pane">
            <paper-spinner
              class="render-spinner"
              active="[[rendering]]"
            ></paper-spinner>
            <pre class$="[[computeRenderedClasses(error)]]">[[processed]]</pre>
          </div>
        </div>
      </app-header-layout>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },

      error: {
        type: Boolean,
        value: false,
      },

      rendering: {
        type: Boolean,
        value: false,
      },

      template: {
        type: String,
        /* eslint-disable max-len */
        value: `Imitate available variables:
{% set my_test_json = {
  "temperature": 25,
  "unit": "°C"
} %}

The temperature is {{ my_test_json.temperature }} {{ my_test_json.unit }}.

{% if is_state("device_tracker.paulus", "home") and
      is_state("device_tracker.anne_therese", "home") -%}
  You are both home, you silly
{%- else -%}
  Anne Therese is at {{ states("device_tracker.anne_therese") }}
  Paulus is at {{ states("device_tracker.paulus") }}
{%- endif %}

For loop example:
{% for state in states.sensor -%}
  {%- if loop.first %}The {% elif loop.last %} and the {% else %}, the {% endif -%}
  {{ state.name | lower }} is {{state.state_with_unit}}
{%- endfor %}.`,
        /* eslint-enable max-len */
        observer: "templateChanged",
      },

      processed: {
        type: String,
        value: "",
      },
    };
  }

  computeFormClasses(narrow) {
    return narrow ? "content fit" : "content fit layout horizontal";
  }

  computeRenderedClasses(error) {
    return error ? "error rendered" : "rendered";
  }

  templateChanged() {
    if (this.error) {
      this.error = false;
    }
    this._debouncer = Debouncer.debounce(
      this._debouncer,
      timeOut.after(500),
      () => {
        this.renderTemplate();
      }
    );
  }

  renderTemplate() {
    this.rendering = true;

    this.opp.callApi("POST", "template", { template: this.template }).then(
      function(processed) {
        this.processed = processed;
        this.rendering = false;
      }.bind(this),
      function(error) {
        this.processed =
          (error && error.body && error.body.message) ||
          "Unknown error rendering template";
        this.error = true;
        this.rendering = false;
      }.bind(this)
    );
  }
}

customElements.define("op-panel-dev-template", OpPanelDevTemplate);
