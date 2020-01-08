import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
} from "lit-element";

import "../../../components/entity/op-state-label-badge";
import "../components/hui-warning-element";

import { LovelaceBadge } from "../types";
import { OpenPeerPower } from "../../../types";
import { StateLabelBadgeConfig } from "./types";
import { actionHandler } from "../common/directives/action-handler-directive";
import { hasAction } from "../common/has-action";
import { ActionHandlerEvent } from "../../../data/lovelace";
import { handleAction } from "../common/handle-action";

@customElement("hui-state-label-badge")
export class HuiStateLabelBadge extends LitElement implements LovelaceBadge {
  @property() public opp?: OpenPeerPower;
  @property() protected _config?: StateLabelBadgeConfig;

  public setConfig(config: StateLabelBadgeConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }

    const stateObj = this.opp.states![this._config.entity!];

    return html`
      <op-state-label-badge
        .opp=${this.opp}
        .state=${stateObj}
        .name=${this._config.name}
        .icon=${this._config.icon}
        .image=${this._config.image}
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config!.hold_action),
          hasDoubleClick: hasAction(this._config!.double_tap_action),
        })}
      ></op-state-label-badge>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.opp!, this._config!, ev.detail.action!);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-state-label-badge": HuiStateLabelBadge;
  }
}
