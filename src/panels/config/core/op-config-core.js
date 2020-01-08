import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../layouts/opp-subpage";
import "../../../resources/op-style";

import "./op-config-section-core";

import LocalizeMixin from "../../../mixins/localize-mixin";

/*
 * @appliesMixin LocalizeMixin
 */
class OpConfigCore extends LocalizeMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        .content {
          padding-bottom: 32px;
        }

        .border {
          margin: 32px auto 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          max-width: 1040px;
        }

        .narrow .border {
          max-width: 640px;
        }
      </style>

      <opp-subpage header="[[localize('ui.panel.config.core.caption')]]">
        <div class$="[[computeClasses(isWide)]]">
          <op-config-section-core
            is-wide="[[isWide]]"
            opp="[[opp]]"
          ></op-config-section-core>
        </div>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
    };
  }

  computeClasses(isWide) {
    return isWide ? "content" : "content narrow";
  }
}

customElements.define("op-config-core", OpConfigCore);
