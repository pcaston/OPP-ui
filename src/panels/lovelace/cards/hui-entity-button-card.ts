import {
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
  CSSResult,
  css,
  customElement,
  property,
} from "lit-element";
import { OppEntity } from "../../../open-peer-power-js-websocket/lib";
import { styleMap } from "lit-html/directives/style-map";
import "@material/mwc-ripple";

import "../../../components/op-card";
import "../components/hui-warning";

import isValidEntityId from "../../../common/entity/valid_entity_id";
import stateIcon from "../../../common/entity/state_icon";
import computeStateDomain from "../../../common/entity/compute_state_domain";
import computeStateName from "../../../common/entity/compute_state_name";
import applyThemesOnElement from "../../../common/dom/apply_themes_on_element";
import computeDomain from "../../../common/entity/compute_domain";

import { OpenPeerPower, LightEntity } from "../../../types";
import { LovelaceCard, LovelaceCardEditor } from "../types";
import { longPress } from "../common/directives/long-press-directive";
import { handleClick } from "../common/handle-click";
import { DOMAINS_TOGGLE } from "../../../common/const";
import { EntityButtonCardConfig } from "./types";

@customElement("hui-entity-button-card")
class HuiEntityButtonCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(/* webpackChunkName: "hui-entity-button-card-editor" */ "../editor/config-elements/hui-entity-button-card-editor");
    return document.createElement("hui-entity-button-card-editor");
  }

  public static getStubConfig(): object {
    return {
      tap_action: { action: "toggle" },
      hold_action: { action: "more-info" },
      show_icon: true,
      show_name: true,
    };
  }

  @property() public opp?: OpenPeerPower;

  @property() private _config?: EntityButtonCardConfig;

  public getCardSize(): number {
    return 2;
  }

  public setConfig(config: EntityButtonCardConfig): void {
    if (!isValidEntityId(config.entity)) {
      throw new Error("Invalid Entity");
    }

    this._config = {
      theme: "default",
      hold_action: { action: "more-info" },
      show_icon: true,
      show_name: true,
      ...config,
    };

    if (DOMAINS_TOGGLE.has(computeDomain(config.entity))) {
      this._config = {
        tap_action: {
          action: "toggle",
        },
        ...this._config,
      };
    } else {
      this._config = {
        tap_action: {
          action: "more-info",
        },
        ...this._config,
      };
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config")) {
      return true;
    }

    const oldOpp = changedProps.get("opp") as OpenPeerPower | undefined;
    if (oldOpp) {
      return (
        oldOpp.states[this._config!.entity] !==
        this.opp!.states[this._config!.entity]
      );
    }
    return true;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }
    const stateObj = this.opp.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-warning
          >"ui.panel.lovelace.warning.entity_not_found entity ${this._config.entity}"
          </hui-warning
        >
      `;
    }

    return html`
      <op-card
        @op-click="${this._handleTap}"
        @op-hold="${this._handleHold}"
        .longPress="${longPress()}"
      >
        ${this._config.show_icon
          ? html`
              <opp-icon
                data-domain="${computeStateDomain(stateObj)}"
                data-state="${stateObj.state}"
                .icon="${this._config.icon || stateIcon(stateObj)}"
                style="${styleMap({
                  filter: this._computeBrightness(stateObj),
                  color: this._computeColor(stateObj),
                })}"
              ></opp-icon>
            `
          : ""}
        ${this._config.show_name
          ? html`
              <span>
                ${this._config.name || computeStateName(stateObj)}
              </span>
            `
          : ""}
        <mwc-ripple></mwc-ripple>
      </op-card>
    `;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._config || !this.opp) {
      return;
    }
    const oldOpp = changedProps.get("opp") as OpenPeerPower | undefined;
    if (!oldOpp || oldOpp.themes !== this.opp.themes) {
      applyThemesOnElement(this, this.opp.themes, this._config.theme);
    }
  }

  static get styles(): CSSResult {
    return css`
      op-card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 4% 0;
        font-size: 1.2rem;
      }

      opp-icon {
        width: 40%;
        height: auto;
        color: var(--paper-item-icon-color, #44739e);
      }

      opp-icon[data-domain="light"][data-state="on"],
      opp-icon[data-domain="switch"][data-state="on"],
      opp-icon[data-domain="binary_sensor"][data-state="on"],
      opp-icon[data-domain="fan"][data-state="on"],
      opp-icon[data-domain="sun"][data-state="above_horizon"] {
        color: var(--paper-item-icon-active-color, #fdd835);
      }

      opp-icon[data-state="unavailable"] {
        color: var(--state-icon-unavailable-color);
      }
    `;
  }

  private _computeBrightness(stateObj: OppEntity | LightEntity): string {
    if (!stateObj.attributes.brightness) {
      return "";
    }
    const brightness = stateObj.attributes.brightness;
    return `brightness(${(brightness + 245) / 5}%)`;
  }

  private _computeColor(stateObj: OppEntity | LightEntity): string {
    if (!stateObj.attributes.hs_color) {
      return "";
    }
    const [hue, sat] = stateObj.attributes.hs_color;
    if (sat <= 10) {
      return "";
    }
    return `hsl(${hue}, 100%, ${100 - sat / 2}%)`;
  }

  private _handleTap() {
    handleClick(this, this.opp!, this._config!, false);
  }

  private _handleHold() {
    handleClick(this, this.opp!, this._config!, true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-entity-button-card": HuiEntityButtonCard;
  }
}
