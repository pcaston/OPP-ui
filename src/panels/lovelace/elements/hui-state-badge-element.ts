import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
  PropertyValues,
} from "lit-element";

import "../../../components/entity/op-state-label-badge";
import "../components/hui-warning-element";

import computeStateName from "../../../common/entity/compute_state_name";
import { LovelaceElement, StateBadgeElementConfig } from "./types";
import { OpenPeerPower } from "../../../types";
import { hasConfigOrEntityChanged } from "../common/has-changed";

@customElement("hui-state-badge-element")
export class HuiStateBadgeElement extends LitElement
  implements LovelaceElement {
  @property() public opp?: OpenPeerPower;
  @property() private _config?: StateBadgeElementConfig;

  public setConfig(config: StateBadgeElementConfig): void {
    if (!config.entity) {
      throw Error("Invalid Configuration: 'entity' required");
    }

    this._config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }

    const stateObj = this.opp.states[this._config.entity!];

    if (!stateObj) {
      return html`
        <hui-warning-element>
          "ui.panel.lovelace.warning.entity_not_found entity ${this._config.entity}"
        </hui-warning-element>
      `;
    }

    return html`
      <op-state-label-badge
        .opp="${this.opp}"
        .state="${stateObj}"
        .title="${this._config.title === undefined
          ? computeStateName(stateObj)
          : this._config.title === null
          ? ""
          : this._config.title}"
      ></op-state-label-badge>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-state-badge-element": HuiStateBadgeElement;
  }
}
