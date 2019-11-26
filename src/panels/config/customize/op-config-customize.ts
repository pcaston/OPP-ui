import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../resources/op-style";
import "../../../components/op-paper-icon-button-arrow-prev";

import "../op-config-section";
import "../op-entity-config";
import "./op-form-customize";

import computeStateName from "../../../common/entity/compute_state_name";
import computeStateDomain from "../../../common/entity/compute_state_domain";
import sortByName from "../../../common/entity/states_sort_by_name";

/*
 */
class OpConfigCustomize extends PolymerElement {
  static get template() {
    return html`
      <style include="op-style"></style>

      <app-header-layout has-scrolling-region="">
        <app-header slot="header" fixed="">
          <app-toolbar>
            <op-paper-icon-button-arrow-prev
              on-click="_backTapped"
            ></op-paper-icon-button-arrow-prev>
            <div main-title="">
              [['ui.panel.config.customize.caption']]
            </div>
          </app-toolbar>
        </app-header>

        <div class$="[[computeClasses(isWide)]]">
          <op-config-section is-wide="[[isWide]]">
            <span slot="header">
              [['ui.panel.config.customize.picker.header']]
            </span>
            <span slot="introduction">
              [['ui.panel.config.customize.picker.introduction']]
            </span>
            <op-entity-config
              opp="[[opp]]"
              label="Entity"
              entities="[[entities]]"
              config="[[entityConfig]]"
            >
            </op-entity-config>
          </op-config-section>
        </div>
      </app-header-layout>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,

      entities: {
        type: Array,
        computed: "computeEntities(opp)",
      },

      entityConfig: {
        type: Object,
        value: {
          component: "op-form-customize",
          computeSelectCaption: (stateObj) =>
            computeStateName(stateObj) +
            " (" +
            computeStateDomain(stateObj) +
            ")",
        },
      },
    };
  }

  computeClasses(isWide) {
    return isWide ? "content" : "content narrow";
  }

  _backTapped() {
    history.back();
  }

  computeEntities(opp) {
    return Object.keys(opp.states)
      .map((key) => opp.states[key])
      .sort(sortByName);
  }
}
customElements.define("op-config-customize", OpConfigCustomize);
