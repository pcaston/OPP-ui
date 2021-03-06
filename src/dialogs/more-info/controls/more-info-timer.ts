import {
  LitElement,
  html,
  TemplateResult,
  CSSResult,
  css,
  property,
  PropertyValues,
  customElement,
} from "lit-element";
import "@material/mwc-button";

import { OpenPeerPower } from "../../../types";
import { TimerEntity } from "../../../data/timer";

@customElement("more-info-timer")
class MoreInfoTimer extends LitElement {
  @property() public opp!: OpenPeerPower;

  @property() public stateObj?: TimerEntity;

  protected render(): TemplateResult {
    if (!this.opp || !this.stateObj) {
      return html``;
    }

    return html`
      <op-attributes
        .stateObj=${this.stateObj}
        .extraFilters=${"remaining"}
      ></op-attributes>
      <div class="actions">
        ${this.stateObj.state === "idle" || this.stateObj.state === "paused"
          ? html`
              <mwc-button
                .action="${"start"}"
                @click="${this._handleActionClick}"
              >
                ${this.opp!.localize("ui.card.timer.actions.start")}
              </mwc-button>
            `
          : ""}
        ${this.stateObj.state === "active"
          ? html`
              <mwc-button
                .action="${"pause"}"
                @click="${this._handleActionClick}"
              >
                ${this.opp!.localize("ui.card.timer.actions.pause")}
              </mwc-button>
            `
          : ""}
        ${this.stateObj.state === "active" || this.stateObj.state === "paused"
          ? html`
              <mwc-button
                .action="${"cancel"}"
                @click="${this._handleActionClick}"
              >
                ${this.opp!.localize("ui.card.timer.actions.cancel")}
              </mwc-button>
              <mwc-button
                .action="${"finish"}"
                @click="${this._handleActionClick}"
              >
                ${this.opp!.localize("ui.card.timer.actions.finish")}
              </mwc-button>
            `
          : ""}
      </div>
    `;
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (!changedProps.has("stateObj") || !this.stateObj) {
      return;
    }
  }

  private _handleActionClick(e: MouseEvent): void {
    const action = (e.currentTarget as any).action;
    this.opp.callService("timer", action, {
      entity_id: this.stateObj!.entity_id,
    });
  }

  static get styles(): CSSResult {
    return css`
      .actions {
        margin: 0 8px;
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "more-info-timer": MoreInfoTimer;
  }
}
