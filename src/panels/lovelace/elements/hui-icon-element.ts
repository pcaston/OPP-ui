import {
  html,
  LitElement,
  TemplateResult,
  property,
  css,
  CSSResult,
  customElement,
} from "lit-element";

import "../../../components/opp-icon";

import { computeTooltip } from "../common/compute-tooltip";
import { handleClick } from "../common/handle-click";
import { longPress } from "../common/directives/long-press-directive";
import { LovelaceElement, IconElementConfig } from "./types";
import { OpenPeerPower } from "../../../types";

@customElement("hui-icon-element")
export class HuiIconElement extends LitElement implements LovelaceElement {
  public opp?: OpenPeerPower;
  @property() private _config?: IconElementConfig;

  public setConfig(config: IconElementConfig): void {
    if (!config.icon) {
      throw Error("Invalid Configuration: 'icon' required");
    }

    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }

    return html`
      <opp-icon
        .icon="${this._config.icon}"
        .title="${computeTooltip(this.opp, this._config)}"
        @op-click="${this._handleTap}"
        @op-hold="${this._handleHold}"
        .longPress="${longPress()}"
      ></opp-icon>
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-icon-element": HuiIconElement;
  }
}
