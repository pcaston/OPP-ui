import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
  css,
  CSSResult,
  PropertyValues,
} from "lit-element";

import "../../../components/entity/op-state-label-badge";
import "../components/hui-warning-element";

import computeStateDisplay from "../../../common/entity/compute_state_display";
import { computeTooltip } from "../common/compute-tooltip";
import { handleClick } from "../common/handle-click";
import { longPress } from "../common/directives/long-press-directive";
import { LovelaceElement, StateLabelElementConfig } from "./types";
import { OpenPeerPower } from "../../../types";
import { hasConfigOrEntityChanged } from "../common/has-changed";

@customElement("hui-state-label-element")
class HuiStateLabelElement extends LitElement implements LovelaceElement {
  @property() public opp?: OpenPeerPower;
  @property() private _config?: StateLabelElementConfig;

  public setConfig(config: StateLabelElementConfig): void {
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
        <hui-warning-element
          label=${this.opp.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this._config.entity
          )}
        ></hui-warning-element>
      `;
    }

    return html`
      <div
        .title="${computeTooltip(this.opp, this._config)}"
        @op-click="${this._handleTap}"
        @op-hold="${this._handleHold}"
        .longPress="${longPress()}"
      >
        ${this._config.prefix}${stateObj
          ? computeStateDisplay(
              this.opp.localize,
              stateObj,
              this.opp.language
            )
          : "-"}${this._config.suffix}
      </div>
    `;
  }

  private _handleTap(): void {
    handleClick(this, this.opp!, this._config!, false);
  }

  private _handleHold(): void {
    handleClick(this, this.opp!, this._config!, true);
  }

  static get styles(): CSSResult {
    return css`
      :host {
        cursor: pointer;
      }
      div {
        padding: 8px;
        white-space: nowrap;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-state-label-element": HuiStateLabelElement;
  }
}
