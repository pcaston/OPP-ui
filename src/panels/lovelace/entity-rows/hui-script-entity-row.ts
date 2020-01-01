import {
  html,
  LitElement,
  TemplateResult,
  property,
  CSSResult,
  css,
  customElement,
  PropertyValues,
} from "lit-element";

import "../components/hui-generic-entity-row";
import "../../../components/entity/op-entity-toggle";
import "../components/hui-warning";

import { OpenPeerPower } from "../../../types";
import { EntityRow, EntityConfig } from "./types";
import { hasConfigOrEntityChanged } from "../common/has-changed";

@customElement("hui-script-entity-row")
class HuiScriptEntityRow extends LitElement implements EntityRow {
  public opp?: OpenPeerPower;

  @property() private _config?: EntityConfig;

  public setConfig(config: EntityConfig): void {
    if (!config) {
      throw new Error("Configuration error");
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

    const stateObj = this.opp.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-warning
          >${this.opp.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this._config.entity
          )}</hui-warning
        >
      `;
    }

    return html`
      <hui-generic-entity-row .opp="${this.opp}" .config="${this._config}">
        ${stateObj.attributes.can_cancel
          ? html`
              <op-entity-toggle
                .opp="${this.opp}"
                .stateObj="${stateObj}"
              ></op-entity-toggle>
            `
          : html`
              <mwc-button @click="${this._callService}">
                ${this.opp!.localize("ui.card.script.execute")}
              </mwc-button>
            `}
      </hui-generic-entity-row>
    `;
  }

  static get styles(): CSSResult {
    return css`
      mwc-button {
        margin-right: -0.57em;
      }
    `;
  }

  private _callService(ev): void {
    ev.stopPropagation();
    this.opp!.callService("script", "turn_on", {
      entity_id: this._config!.entity,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-script-entity-row": HuiScriptEntityRow;
  }
}
