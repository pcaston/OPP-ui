import "@polymer/paper-dialog-behavior/paper-dialog-shared-styles";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable";
import {
  LitElement,
  html,
  customElement,
  property,
} from "lit-element";

import "../resources/op-style";

import "./more-info/more-info-controls";
import "./more-info/more-info-settings";

import computeStateDomain from "../common/entity/compute_state_domain";

import DialogMixin from "../mixins/dialog-mixin";
import { OpenPeerPower, OppEntity } from '../types';

/*
 * @appliesMixin DialogMixin
 */
// @ts-ignore
@customElement("opp-more-info-dialog")
export class OppMoreInfoDialog extends DialogMixin(LitElement)  {
  @property({type : Object}) public opp?: OpenPeerPower;
  @property({type : Object}) public stateObj!: OppEntity;
  @property({type : Boolean}) public large = true;
  @property({type : Object}) public _dialogElement = {};
  @property({type : Object}) public _registryInfo = {};
  @property({type : Object}) public _page = {
    type: String,
    value: "ettings",
  };
  @property({type : String }) public dataDomain = this._computeDomain(this.stateObj);

  static get styles() {
    return [
      css`
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
            --opp-more-info-app-toolbar-title: {
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
        `
      ];
    }
    protected render() {
      console.log('more info dialog');
      this.stateObj = this._computeStateObj(this.opp);
      return html`
      ${this._page?
        html`
        <more-info-controls
          class="no-padding"
          .opp="${this.opp}"
          .stateObj="${this.stateObj}"
          dialog-element="${this._dialogElement}"
          can-configure="${this._registryInfo}"
          large="${this.large}"
        ></more-info-controls>
      ` : html`<p>Not much happening</p>`
      }
      ${!this._equals(this._page, "settings")?
        html`
        <more-info-settings
          class="no-padding"
          .opp="${this.opp}"
          .stateObj="${this.stateObj}"
          .registryInfo="${this._registryInfo}"
        ></more-info-settings>
      ` : html`<p>Not much happening in settings</p>`
      }
    `;
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
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
  _equals(a, b) {
    return a === b;
  }
}