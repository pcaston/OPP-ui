import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../layouts/opp-tabs-subpage";
import "../../../resources/op-style";

import "./op-config-section-server-control";

import LocalizeMixin from "../../../mixins/localize-mixin";
import { configSections } from "../op-panel-config";

/*
 * @appliesMixin LocalizeMixin
 */
class OpConfigServerControl extends LocalizeMixin(PolymerElement) {
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

      <opp-tabs-subpage
        opp="[[opp]]"
        narrow="[[narrow]]"
        route="[[route]]"
        back-path="/config"
        tabs="[[_computeTabs()]]"
        show-advanced="[[showAdvanced]]"
      >
        <div class$="[[computeClasses(isWide)]]">
          <op-config-section-server-control
            is-wide="[[isWide]]"
            show-advanced="[[showAdvanced]]"
            opp="[[opp]]"
          ></op-config-section-server-control>
        </div>
      </opp-tabs-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
      narrow: Boolean,
      route: Object,
      showAdvanced: Boolean,
    };
  }

  _computeTabs() {
    return configSections.general;
  }

  computeClasses(isWide) {
    return isWide ? "content" : "content narrow";
  }
}

customElements.define("op-config-server-control", OpConfigServerControl);
