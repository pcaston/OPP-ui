import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable";
import "@polymer/paper-icon-button/paper-icon-button";
import { LitElement, html, property, customElement } from 'lit-element';
import { OpenPeerPower, OppEntity } from '../../types';

import "../../components/state-history-charts";
import "../../data/op-state-history-data";
import "../../resources/op-style";
import "../../state-summary/state-card-content";

import "./controls/more-info-content";

import computeStateName from "../../common/entity/compute_state_name";
import computeStateDomain from "../../common/entity/compute_state_domain";
import isComponentLoaded from "../../common/config/is_component_loaded";
import { DOMAINS_MORE_INFO_NO_HISTORY } from "../../common/const";
import { EventsMixin } from "../../mixins/events-mixin";

const DOMAINS_NO_INFO = ["camera", "configurator", "history_graph"];
/*
 * @appliesMixin EventsMixin
 */
// @ts-ignore
@customElement('more-info-controls')
// @ts-ignore
 class MoreInfoControls extends EventsMixin(LitElement) {
  @property({type: Object})
  private opp: OpenPeerPower = {};
  @property({type: Object})
  private stateObj!: OppEntity;
  @property({type: Object})
  private dialogElement!: OppEntity;
  @property({type: Boolean})
  private canConfigure!: OppEntity;
  @property({type: String})
  private domain = "";
  @property({type: Object})
  private _stateHistory = {};
  @property({type: Object})
  private _stateHistoryLoading = {};
  @property({type: Boolean})
  private large = false;
  @property({type: Object})
  private _cacheConfig = {
    refresh: 60,
    cacheKey: null,
    hoursToShow: 24,
  };

  protected render() {
    this.domain = this._computeDomain(this.stateObj);
    debugger;
    return html`
      <style include="op-style-dialog">
        app-toolbar {
          color: var(--more-info-header-color);
          background-color: var(--more-info-header-background);
        }

        app-toolbar [main-title] {
          @apply --op-more-info-app-toolbar-title;
        }

        state-card-content {
          display: block;
          padding: 16px;
        }

        state-history-charts {
          max-width: 100%;
          margin-bottom: 16px;
        }

        @media all and (min-width: 451px) and (min-height: 501px) {
          .main-title {
            pointer-events: auto;
            cursor: default;
          }
        }

        paper-dialog-scrollable {
          padding-bottom: 16px;
        }
        
       
        :host([${this.domain}="camera"]) paper-dialog-scrollable {
          margin: 0 -24px -21px;
        }

        :host([rtl]) app-toolbar {
          direction: rtl;
          text-align: right;
        }
      </style>

      <app-toolbar>
        <paper-icon-button
          icon="opp:close"
          dialog-dismiss=""
        ></paper-icon-button>
        <div class="main-title" main-title="" @click="enlarge">
          ${this._computeStateName(this.stateObj)}
        </div>
        <paper-icon-button
          icon="opp:settings"
          @click=${this._gotoSettings}
          ?active=${this.canConfigure}
        ></paper-icon-button>
      </app-toolbar>

      <state-card-content
        .state-obj="${this.stateObj}"
        .opp="${this.opp}"
        in-dialog=""
        ?active=${this._computeShowStateInfo(this.stateObj)}
      ></state-card-content>

      <paper-dialog-scrollable dialog-element="${this.dialogElement}">
        <op-state-history-data
          .opp="${this.opp}"
          filter-type="recent-entity"
          entity-id="${this.stateObj.entity_id}"
          data="${this._stateHistory}"
          is-loading="${this._stateHistoryLoading}"
          cache-config="${this._cacheConfig}"
          ?active=${this._computeShowHistoryComponent(this.opp, this.stateObj)}
        ></op-state-history-data>
        <state-history-charts
          .opp="${this.opp}"
          history-data="${this._stateHistory}"
          is-loading-data="${this._stateHistoryLoading}"
          up-to-now
          ?active=${this._computeShowHistoryComponent(this.opp, this.stateObj)}
        ></state-history-charts>

        <more-info-content
          .state-obj="${this.stateObj}"
          .opp="${this.opp}"
        ></more-info-content>
      </paper-dialog-scrollable>
    `;
  }

  enlarge() {
    this.large = !this.large;
  }

  _computeShowStateInfo(stateObj) {
    return !stateObj || !DOMAINS_NO_INFO.includes(computeStateDomain(stateObj));
  }

  _computeShowHistoryComponent(opp, stateObj) {
    return (
      opp &&
      stateObj &&
      isComponentLoaded(opp, "history") &&
      !DOMAINS_MORE_INFO_NO_HISTORY.includes(computeStateDomain(stateObj))
    );
  }

  _computeDomain(stateObj) {
    return stateObj ? computeStateDomain(stateObj) : "";
  }

  _computeStateName(stateObj) {
    return stateObj ? computeStateName(stateObj) : "";
  }

  _stateObjChanged(newVal) {
    if (!newVal) {
      return;
    }

    if (this._cacheConfig.cacheKey !== `more_info.${newVal.entity_id}`) {
      this._cacheConfig = Object.assign({}, this._cacheConfig, {
        cacheKey: `more_info.${newVal.entity_id}`,
      });
    }
  }

  _gotoSettings() {
    this.fire("more-info-page", { page: "settings" });
  }

}
