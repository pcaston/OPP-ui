import {
  html,
  LitElement,
  PropertyDeclarations,
  TemplateResult,
} from "lit-element";

import "./cards/hui-entities-card";

import { computeUnusedEntities } from "./common/compute-unused-entities";
import { createCardElement } from "./common/create-card-element";
import { OpenPeerPower } from "../../types";
import { LovelaceCard } from "./types";
import { LovelaceConfig } from "../../data/lovelace";
import computeDomain from "../../common/entity/compute_domain";

export class HuiUnusedEntities extends LitElement {
  private _opp?: OpenPeerPower;
  private _config?: LovelaceConfig;
  private _elements?: LovelaceCard[];

  static get properties(): PropertyDeclarations {
    return {
      _opp: {},
      _config: {},
    };
  }

  set opp(opp: OpenPeerPower) {
    this._opp = opp;
    if (!this._elements) {
      this._createElements();
      return;
    }
    for (const element of this._elements) {
      element.opp = this._opp;
    }
  }

  public setConfig(config: LovelaceConfig): void {
    this._config = config;
    this._createElements();
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this._opp) {
      return html``;
    }

    return html`
      ${this.renderStyle()}
      <div id="root">${this._elements}</div>
    `;
  }

  private renderStyle(): TemplateResult {
    return html`
      <style>
        #root {
          padding: 4px;
          display: flex;
          flex-wrap: wrap;
        }
        hui-entities-card {
          max-width: 400px;
          padding: 4px;
          flex: 1 auto;
        }
      </style>
    `;
  }

  private _createElements(): void {
    if (!this._opp) {
      return;
    }
    const domains: { [domain: string]: string[] } = {};
    computeUnusedEntities(this._opp, this._config!).forEach((entity) => {
      const domain = computeDomain(entity);

      if (!(domain in domains)) {
        domains[domain] = [];
      }
      domains[domain].push(entity);
    });
    this._elements = Object.keys(domains)
      .sort()
      .map((domain) => {
        const el = createCardElement({
          type: "entities",
          title: this._opp!.localize(`domain.${domain}`) || domain,
          entities: domains[domain].map((entity) => ({
            entity,
            secondary_info: "entity-id",
          })),
          show_header_toggle: false,
        });
        el.opp = this._opp;
        return el;
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-unused-entities": HuiUnusedEntities;
  }
}
customElements.define("hui-unused-entities", HuiUnusedEntities);
