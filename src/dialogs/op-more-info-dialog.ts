import "@polymer/paper-dialog-behavior/paper-dialog-shared-styles";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../resources/op-style";

import "./more-info/more-info-controls";
import "./more-info/more-info-settings";

import computeStateDomain from "../common/entity/compute_state_domain";
import isComponentLoaded from "../common/config/is_component_loaded";

import DialogMixin from "../mixins/dialog-mixin";
import { OpenPeerPower, OppEntity } from '../types';

/*
 * @appliesMixin DialogMixin
 */
class OpMoreInfoDialog extends DialogMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="op-style-dialog paper-dialog-shared-styles">
        :host {
          font-size: 14px;
          width: 365px;
          border-radius: 2px;
        }

        more-info-controls,
        more-info-settings {
          --more-info-header-background: var(--secondary-background-color);
          --more-info-header-color: var(--primary-text-color);
          --op-more-info-app-toolbar-title: {
            /* Design guideline states 24px, changed to 16 to align with state info */
            margin-left: 16px;
            line-height: 1.3em;
            max-height: 2.6em;
            overflow: hidden;
            /* webkit and blink still support simple multiline text-overflow */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }
        }

          /* overrule the op-style-dialog max-height on small screens */
        @media all and (max-width: 450px), all and (max-height: 500px) {
          more-info-controls,
          more-info-settings {
            --more-info-header-background: var(--primary-color);
            --more-info-header-color: var(--text-primary-color);
          }
          :host {
            width: 100% !important;
            border-radius: 0px;
            position: fixed !important;
            margin: 0;
          }
          :host::before {
            content: "";
            position: fixed;
            z-index: -1;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background-color: inherit;
          }
        }

        :host([data-domain="camera"]) {
          width: auto;
        }

        :host([data-domain="history_graph"]),
        :host([large]) {
          width: 90%;
        }
      </style>

      <template is="dom-if" if="[[!_page]]">
        <more-info-controls
          class="no-padding"
          opp="[[opp]]"
          state-obj="[[stateObj]]"
          dialog-element="[[_dialogElement]]"
          can-configure="[[_registryInfo]]"
          large="{{large}}"
        ></more-info-controls>
      </template>
      <template is="dom-if" if='[[_equals(_page, "settings")]]'>
        <more-info-settings
          class="no-padding"
          opp="[[opp]]"
          state-obj="[[stateObj]]"
          registry-info="{{_registryInfo}}"
        ></more-info-settings>
      </template>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      stateObj: {
        type: Object,
        computed: "_computeStateObj(opp)",
        observer: "_stateObjChanged",
      },

      large: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_largeChanged",
      },

      _dialogElement: Object,
      _registryInfo: Object,

      _page: {
        type: String,
        value: null,
      },

      dataDomain: {
        computed: "_computeDomain(stateObj)",
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return ["_dialogOpenChanged(opened)"];
  }

  ready() {
    super.ready();
    this._dialogElement = this;
    this.addEventListener("more-info-page", (ev) => {
      this._page = ev.detail.page;
    });
  }

  _computeDomain(stateObj) {
    return stateObj ? computeStateDomain(stateObj) : "";
  }

  _computeStateObj(opp) {
    return opp.states[opp.moreInfoEntityId] || null;
  }

  async _stateObjChanged(newVal, oldVal) {
    if (!newVal) {
      this.setProperties({
        opened: false,
        _page: null,
        _registryInfo: null,
        large: false,
      });
      return;
    }

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        // allow dialog to render content before showing it so it will be
        // positioned correctly.
        this.opened = true;
      })
    );

    if (
      !isComponentLoaded(this.opp, "config") ||
      (oldVal && oldVal.entity_id === newVal.entity_id)
    ) {
      return;
    }

    if (this.opp.user.is_admin) {
      try {
        const info = await this.opp.callWS({
          type: "config/entity_registry/get",
          entity_id: newVal.entity_id,
        });
        this._registryInfo = info;
      } catch (err) {
        this._registryInfo = null;
      }
    }
  }

  _dialogOpenChanged(newVal) {
    if (!newVal && this.stateObj) {
      this.fire("opp-more-info", { entityId: null });
    }
  }

  _equals(a, b) {
    return a === b;
  }

  _largeChanged() {
    this.notifyResize();
  }
}
customElements.define("op-more-info-dialog", OpMoreInfoDialog);