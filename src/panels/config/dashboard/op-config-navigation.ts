import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import NavigateMixin from "../../../mixins/navigate-mixin";
import LocalizeMixin from "../../../mixins/localize-mixin";

import isComponentLoaded from "../../../common/config/is_component_loaded";

import "../../../components/op-card";
import "../../../components/op-icon-next";

const CORE_PAGES = ["core", "customize", "entity_registry", "area_registry"];
/*
 * @appliesMixin LocalizeMixin
 * @appliesMixin NavigateMixin
 */
class OpConfigNavigation extends LocalizeMixin(NavigateMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="iron-flex">
        op-card {
          overflow: hidden;
        }
        paper-item {
          cursor: pointer;
        }
      </style>
      <op-card>
        <template is="dom-repeat" items="[[pages]]">
          <template is="dom-if" if="[[_computeLoaded(opp, item)]]">
            <paper-item on-click="_navigate">
              <paper-item-body two-line="">
                [[_computeCaption(item, localize)]]
                <div secondary="">[[_computeDescription(item, localize)]]</div>
              </paper-item-body>
              <op-icon-next></op-icon-next>
            </paper-item>
          </template>
        </template>
      </op-card>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },

      pages: {
        type: Array,
        value: [
          "core",
          "person",
          "entity_registry",
          "area_registry",
          "automation",
          "script",
          "zha",
          "zwave",
          "customize",
        ],
      },
    };
  }

  _computeLoaded(opp, page) {
    return CORE_PAGES.includes(page) || isComponentLoaded(opp, page);
  }

  _computeCaption(page, localize) {
    return localize(`ui.panel.config.${page}.caption`);
  }

  _computeDescription(page, localize) {
    return localize(`ui.panel.config.${page}.description`);
  }

  _navigate(ev) {
    this.navigate("/config/" + ev.model.item);
  }
}

customElements.define("op-config-navigation", OpConfigNavigation);
