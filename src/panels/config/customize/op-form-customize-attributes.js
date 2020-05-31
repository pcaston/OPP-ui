import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "./op-customize-attribute";

class OpFormCustomizeAttributes extends MutableData(PolymerElement) {
  static get template() {
    return html`
      <style>
        [hidden] {
          display: none;
        }
      </style>
      <template is="dom-repeat" items="{{attributes}}" mutable-data="">
        <op-customize-attribute item="{{item}}" hidden$="[[item.closed]]">
        </op-customize-attribute>
      </template>
    `;
  }

  static get properties() {
    return {
      attributes: {
        type: Array,
        notify: true,
      },
    };
  }
}
customElements.define(
  "op-form-customize-attributes",
  OpFormCustomizeAttributes
);
