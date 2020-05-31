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

@customElement("op-advanced-mode-row")
class AdvancedModeRow extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public narrow!: boolean;
  @property() public coreUserData?: CoreFrontendUserData;

  protected render(): TemplateResult {
    return html`
      <op-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${this.opp.localize("ui.panel.profile.advanced_mode.title")}
        </span>
        <span slot="description">
          ${this.opp.localize("ui.panel.profile.advanced_mode.description")}
          <a
            href="https://www.open-peer-power.io/blog/2019/07/17/release-96/#advanced-mode"
            target="_blank"
            >${this.opp.localize("ui.panel.profile.advanced_mode.link_promo")}
          </a>
        </span>
        <op-switch
          .checked=${this.coreUserData && this.coreUserData.showAdvanced}
          .disabled=${this.coreUserData === undefined}
          @change=${this._advancedToggled}
        ></op-switch>
      </op-settings-row>
    `;
  }

  private async _advancedToggled(ev) {
    getOptimisticFrontendUserDataCollection(this.opp.connection, "core").save({
      showAdvanced: ev.currentTarget.checked,
    });
  }

  static get styles(): CSSResult {
    return css`
      a {
        color: var(--primary-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-advanced-mode-row": AdvancedModeRow;
  }
}
