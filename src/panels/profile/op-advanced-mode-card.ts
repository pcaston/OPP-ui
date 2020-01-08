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
import {
  CoreFrontendUserData,
  getOptimisticFrontendUserDataCollection,
} from "../../data/frontend";

@customElement("op-advanced-mode-card")
class AdvancedModeCard extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public coreUserData?: CoreFrontendUserData;

  protected render(): TemplateResult | void {
    return html`
      <op-card>
        <div class="card-header">
          <div class="title">
            ${this.opp.localize("ui.panel.profile.advanced_mode.title")}
          </div>
          <op-switch
            .checked=${this.coreUserData && this.coreUserData.showAdvanced}
            .disabled=${this.coreUserData === undefined}
            @change=${this._advancedToggled}
          ></op-switch>
        </div>
        <div class="card-content">
          ${this.opp.localize("ui.panel.profile.advanced_mode.description")}
        </div>
      </op-card>
    `;
  }

  private async _advancedToggled(ev) {
    getOptimisticFrontendUserDataCollection(this.opp.connection, "core").save({
      showAdvanced: ev.currentTarget.checked,
    });
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
