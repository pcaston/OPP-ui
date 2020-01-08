import {
  LitElement,
  property,
  TemplateResult,
  html,
  customElement,
  CSSResult,
  css,
} from "lit-element";
import "../../components/op-card";
import { OpenPeerPower } from "../../types";

@customElement("op-advanced-mode-card")
class AdvancedModeCard extends LitElement {
  @property() public opp!: OpenPeerPower;

  protected render(): TemplateResult | void {
    return html`
      <op-card>
        <div class="card-header">
          <div class="title">
            ${this.opp.localize("ui.panel.profile.advanced_mode.title")}
          </div>
        </div>
        <div class="card-content">
          ${this.opp.localize("ui.panel.profile.advanced_mode.description")}
        </div>
      </op-card>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .card-header {
        display: flex;
      }
      .title {
        flex: 1;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-advanced-mode-card": AdvancedModeCard;
  }
}
