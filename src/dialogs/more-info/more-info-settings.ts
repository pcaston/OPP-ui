import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@material/mwc-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import { LitElement, html, property, customElement } from 'lit-element';

import { EventsMixin } from "../../mixins/events-mixin";
import { OpenPeerPower, OppEntity } from '../../types';

import computeStateName from "../../common/entity/compute_state_name";
import computeDomain from "../../common/entity/compute_domain";
import { updateEntityRegistryEntry } from "../../data/entity_registry";

import "../../components/op-paper-icon-button-arrow-prev";
/*
 * @appliesMixin EventsMixin
 */
// @ts-ignore
@customElement('more-info-settings')
export class MoreInfoSettings extends EventsMixin(LitElement) {
  @property({type: Object})
  private opp: OpenPeerPower = {};
  @property({type: Object})
  private stateObj!: OppEntity;
  @property({type: Object})
  private registryInfo!;
  @property({type: String}) private _name = "";
  @property({type: String}) private _entityId = "";

  protected render() {
    return html`
      <style>
        app-toolbar {
          color: var(--more-info-header-color);
          background-color: var(--more-info-header-background);

          /* to fit save button */
          padding-right: 0;
        }

        app-toolbar [main-title] {
          @apply --op-more-info-app-toolbar-title;
        }

        app-toolbar mwc-button {
          font-size: 0.8em;
          margin: 0;
        }

        .form {
          padding: 0 24px 24px;
        }
      </style>

      <app-toolbar>
        <op-paper-icon-button-arrow-prev
          @click="_backTapped"
        ></op-paper-icon-button-arrow-prev>
        <div main-title="">${this._computeStateName(this.stateObj)}</div>
        <mwc-button @click="_save" disabled="${this._computeInvalid(this._entityId)}"
          >Save</mwc-button
        >
      </app-toolbar>

      <div class="form">
        <paper-input
          value="${this._name}"
          label="Name"
        ></paper-input>
        <paper-input
          value="${this._entityId}"
          label="Entity Id"
          error-message="Domain needs to stay the same"
          invalid="${this._computeInvalid(this._entityId)}"
        ></paper-input>
      </div>
    `;
  }

  _computeStateName(stateObj) {
    if (!stateObj) return "";
    return computeStateName(stateObj);
  }

  _computeInvalid(entityId) {
    return computeDomain(this.stateObj.entity_id) !== computeDomain(entityId);
  }

  _backTapped() {
    this.fire("more-info-page", { page: null });
  }

  async _save() {
    try {
      const info = await updateEntityRegistryEntry(
        this.opp,
        this.stateObj.entity_id,
        {
          name: this._name,
          new_entity_id: this._entityId,
        }
      );

      this.registryInfo = info;

      // Keep the more info dialog open at the new entity.
      if (this.stateObj.entity_id !== this._entityId) {
        this.fire("opp-more-info", { entityId: this._entityId });
      }
    } catch (err) {
      alert(`save failed: ${err.message}`);
    }
  }
}