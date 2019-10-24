import {
  LitElement,
  TemplateResult,
  property,
  html,
  customElement,
} from "lit-element";
import "@polymer/paper-icon-button/paper-icon-button-light";

import { OpenPeerPower } from "../../types";
import { PolymerChangedEvent } from "../../polymer-types";
import { fireEvent } from "../../common/dom/fire_event";
import isValidEntityId from "../../common/entity/valid_entity_id";

import "./op-entity-picker";
// Not a duplicate, type import
// tslint:disable-next-line
import { HaEntityPickerEntityFilterFunc } from "./op-entity-picker";
import { OppEntity } from "../../open-peer-power-js-websocket/lib";

@customElement("op-entities-picker")
class OpEntitiesPickerLight extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public value?: string[];
  @property({ attribute: "domain-filter" }) public domainFilter?: string;
  @property({ attribute: "picked-entity-label" })
  public pickedEntityLabel?: string;
  @property({ attribute: "pick-entity-label" }) public pickEntityLabel?: string;

  protected render(): TemplateResult | void {
    if (!this.opp) {
      return;
    }
    const currentEntities = this._currentEntities;
    return html`
      ${currentEntities.map(
        (entityId) => html`
          <div>
            <op-entity-picker
              allow-custom-entity
              .curValue=${entityId}
              .opp=${this.opp}
              .domainFilter=${this.domainFilter}
              .entityFilter=${this._entityFilter}
              .value=${entityId}
              .label=${this.pickedEntityLabel}
              @value-changed=${this._entityChanged}
            ></op-entity-picker>
          </div>
        `
      )}
      <div>
        <op-entity-picker
          .opp=${this.opp}
          .domainFilter=${this.domainFilter}
          .entityFilter=${this._entityFilter}
          .label=${this.pickEntityLabel}
          @value-changed=${this._addEntity}
        ></op-entity-picker>
      </div>
    `;
  }

  private _entityFilter: HaEntityPickerEntityFilterFunc = (
    stateObj: OppEntity
  ) => !this.value || !this.value.includes(stateObj.entity_id);

  private get _currentEntities() {
    return this.value || [];
  }

  private async _updateEntities(entities) {
    fireEvent(this, "value-changed", {
      value: entities,
    });

    this.value = entities;
  }

  private _entityChanged(event: PolymerChangedEvent<string>) {
    event.stopPropagation();
    const curValue = (event.currentTarget as any).curValue;
    const newValue = event.detail.value;
    if (
      newValue === curValue ||
      (newValue !== "" && !isValidEntityId(newValue))
    ) {
      return;
    }
    if (newValue === "") {
      this._updateEntities(
        this._currentEntities.filter((ent) => ent !== curValue)
      );
    } else {
      this._updateEntities(
        this._currentEntities.map((ent) => (ent === curValue ? newValue : ent))
      );
    }
  }

  private async _addEntity(event: PolymerChangedEvent<string>) {
    event.stopPropagation();
    const toAdd = event.detail.value;
    (event.currentTarget as any).value = "";
    if (!toAdd) {
      return;
    }
    const currentEntities = this._currentEntities;
    if (currentEntities.includes(toAdd)) {
      return;
    }

    this._updateEntities([...currentEntities, toAdd]);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-entities-picker": OpEntitiesPickerLight;
  }
}
