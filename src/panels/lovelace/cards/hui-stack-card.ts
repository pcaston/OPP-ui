import { html, LitElement, TemplateResult } from "lit-element";

import { createCardElement } from "../common/create-card-element";
import { LovelaceCard } from "../types";
import { LovelaceCardConfig } from "../../../data/lovelace";
import { OpenPeerPower } from "../../../types";
import { StackCardConfig } from "./types";

export abstract class HuiStackCard extends LitElement implements LovelaceCard {
  static get properties() {
    return {
      _config: {},
    };
  }

  set opp(opp: OpenPeerPower) {
    this._opp = opp;

    if (!this._cards) {
      return;
    }

    for (const element of this._cards) {
      element.opp = this._opp;
    }
  }
  protected _cards?: LovelaceCard[];
  private _config?: StackCardConfig;
  private _opp?: OpenPeerPower;

  public abstract getCardSize(): number;

  public setConfig(config: StackCardConfig): void {
    if (!config || !config.cards || !Array.isArray(config.cards)) {
      throw new Error("Card config incorrect");
    }
    this._config = config;
    this._cards = config.cards.map((card) => {
      const element = this._createCardElement(card) as LovelaceCard;
      return element;
    });
  }

  protected render(): TemplateResult | void {
    if (!this._config) {
      return html``;
    }

    return html`
      ${this.renderStyle()}
      <div id="root">${this._cards}</div>
    `;
  }

  protected abstract renderStyle(): TemplateResult;

  private _createCardElement(cardConfig: LovelaceCardConfig) {
    const element = createCardElement(cardConfig) as LovelaceCard;
    if (this._opp) {
      element.opp = this._opp;
    }
    element.addEventListener(
      "ll-rebuild",
      (ev) => {
        ev.stopPropagation();
        this._rebuildCard(element, cardConfig);
      },
      { once: true }
    );
    return element;
  }

  private _rebuildCard(
    cardElToReplace: LovelaceCard,
    config: LovelaceCardConfig
  ): void {
    const newCardEl = this._createCardElement(config);
    cardElToReplace.parentElement!.replaceChild(newCardEl, cardElToReplace);
    this._cards = this._cards!.map((curCardEl) =>
      curCardEl === cardElToReplace ? newCardEl : curCardEl
    );
  }
}
