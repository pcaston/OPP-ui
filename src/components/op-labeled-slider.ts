import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "./op-paper-slider";
import "./opp-icon";

class OpLabeledSlider extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        .title {
          margin-bottom: 16px;
          opacity: var(--dark-primary-opacity);
        }

        opp-icon {
          float: left;
          margin-top: 4px;
          opacity: var(--dark-secondary-opacity);
        }

        op-paper-slider {
          background-image: var(--op-slider-background);
        }
      </style>

      <div class="title">[[caption]]</div>
      <div class="extra-container"><slot name="extra"></slot></div>
      <div class="slider-container">
        <opp-icon icon="[[icon]]" hidden$="[[!icon]]"></opp-icon>
        <op-paper-slider
          min="[[min]]"
          max="[[max]]"
          step="[[step]]"
          pin="[[pin]]"
          disabled="[[disabled]]"
          disabled="[[disabled]]"
          value="{{value}}"
        ></op-paper-slider>
      </div>
    `;
  }

  static get properties() {
    return {
      caption: String,
      disabled: Boolean,
      min: Number,
      max: Number,
      pin: Boolean,
      step: Number,

      extra: {
        type: Boolean,
        value: false,
      },
      ignoreBarTouch: {
        type: Boolean,
        value: true,
      },
      icon: {
        type: String,
        value: "",
      },
      value: {
        type: Number,
        notify: true,
      },
    };
  }
}

customElements.define("op-labeled-slider", OpLabeledSlider);
