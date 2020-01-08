import {
  property,
  PropertyValues,
  customElement,
  UpdatingElement,
} from "lit-element";

import applyThemesOnElement from "../../../common/dom/apply_themes_on_element";

import { OpenPeerPower } from "../../../types";
import { LovelaceCard } from "../types";
import { createCardElement } from "../common/create-card-element";
import { LovelaceViewConfig } from "../../../data/lovelace";

@customElement("hui-panel-view")
export class HUIPanelView extends UpdatingElement {
  @property() public opp?: OpenPeerPower;
  @property() public config?: LovelaceViewConfig;

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.style.setProperty("background", "var(--lovelace-background)");
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    const opp = this.opp!;
    const oppChanged = changedProperties.has("opp");
    const oldOpp = changedProperties.get("opp") as this["opp"] | undefined;
    const configChanged = changedProperties.has("config");

    if (configChanged) {
      this._createCard();
    } else if (oppChanged) {
      (this.lastChild! as LovelaceCard).opp = this.opp;
    }

    if (
      configChanged ||
      (oppChanged &&
        oldOpp &&
        (opp.themes !== oldOpp.themes ||
          opp.selectedTheme !== oldOpp.selectedTheme))
    ) {
      applyThemesOnElement(this, opp.themes, this.config!.theme);
    }
  }

  private _createCard(): void {
    if (this.lastChild) {
      this.removeChild(this.lastChild);
    }

    const card: LovelaceCard = createCardElement(this.config!.cards![0]);
    card.opp = this.opp;
    card.isPanel = true;
    this.appendChild(card);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-panel-view": HUIPanelView;
  }
}
