import {
  html,
  LitElement,
  TemplateResult,
  css,
  CSSResult,
  property,
  customElement,
  PropertyValues,
} from "lit-element";
import { OppEntity } from "../../../websocket/lib";

import "../../../components/op-card";
import "../../../components/op-icon";

import { computeStateName } from "../../../common/entity/compute_state_name";

import { DevconCardEditor, DevconCard } from "../types";
import { OpenPeerPower } from "../../../types";
import { fireEvent } from "../../../common/dom/fire_event";
import { hasConfigOrEntityChanged } from "../common/has-changed";
import { PlantStatusCardConfig, PlantAttributeTarget } from "./types";
import { applyThemesOnElement } from "../../../common/dom/apply_themes_on_element";
import { actionHandler } from "../common/directives/action-handler-directive";

const SENSORS = {
  moisture: "opp:water",
  temperature: "opp:thermometer",
  brightness: "opp:white-balance-sunny",
  conductivity: "opp:emoticon-poop",
  battery: "opp:battery",
};

@customElement("hui-plant-status-card")
class HuiPlantStatusCard extends LitElement implements DevconCard {
  public static async getConfigElement(): Promise<DevconCardEditor> {
    await import(
      /* webpackChunkName: "hui-plant-status-card-editor" */ "../editor/config-elements/hui-plant-status-card-editor"
    );
    return document.createElement("hui-plant-status-card-editor");
  }

  public static getStubConfig(): object {
    return { entity: "" };
  }

  @property() public opp?: OpenPeerPower;

  @property() private _config?: PlantStatusCardConfig;

  public getCardSize(): number {
    return 3;
  }

  public setConfig(config: PlantStatusCardConfig): void {
    if (!config.entity || config.entity.split(".")[0] !== "plant") {
      throw new Error("Specify an entity from within the plant domain.");
    }

    this._config = config;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._config || !this.opp) {
      return;
    }
    const oldOpp = changedProps.get("opp") as OpenPeerPower | undefined;
    const oldConfig = changedProps.get("_config") as
      | PlantStatusCardConfig
      | undefined;

    if (
      !oldOpp ||
      !oldConfig ||
      oldOpp.themes !== this.opp.themes ||
      oldConfig.theme !== this._config.theme
    ) {
      applyThemesOnElement(this, this.opp.themes, this._config.theme);
    }
  }

  protected render(): TemplateResult {
    if (!this.opp || !this._config) {
      return html``;
    }

    const stateObj = this.opp.states[this._config!.entity];

    if (!stateObj) {
      return html`
        <hui-warning
          >${this.opp.localize(
            "ui.panel.devcon.warning.entity_not_found",
            "entity",
            this._config.entity
          )}</hui-warning
        >
      `;
    }

    return html`
      <op-card
        class="${stateObj.attributes.entity_picture ? "has-plant-image" : ""}"
      >
        <div
          class="banner"
          style="background-image:url(${stateObj.attributes.entity_picture})"
        >
          <div class="header">
            ${this._config.name || computeStateName(stateObj)}
          </div>
        </div>
        <div class="content">
          ${this.computeAttributes(stateObj).map(
            (item) => html`
              <div
                class="attributes"
                @action=${this._handleMoreInfo}
                .actionHandler=${actionHandler()}
                tabindex="0"
                .value="${item}"
              >
                <div>
                  <op-icon
                    icon="${this.computeIcon(
                      item,
                      stateObj.attributes.battery
                    )}"
                  ></op-icon>
                </div>
                <div
                  class="${stateObj.attributes.problem.indexOf(item) === -1
                    ? ""
                    : "problem"}"
                >
                  ${stateObj.attributes[item]}
                </div>
                <div class="uom">
                  ${stateObj.attributes.unit_of_measurement_dict[item] || ""}
                </div>
              </div>
            `
          )}
        </div>
      </op-card>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .banner {
        display: flex;
        align-items: flex-end;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        padding-top: 12px;
      }

      .has-plant-image .banner {
        padding-top: 30%;
      }

      .header {
        /* start paper-font-headline style */
        font-family: "Roboto", "Noto", sans-serif;
        -webkit-font-smoothing: antialiased; /* OS X subpixel AA bleed bug */
        text-rendering: optimizeLegibility;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: -0.012em;
        /* end paper-font-headline style */

        line-height: 40px;
        padding: 8px 16px;
      }

      .has-plant-image .header {
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        padding: 16px;
        color: white;
        width: 100%;
        background: rgba(0, 0, 0, var(--dark-secondary-opacity));
      }

      .content {
        display: flex;
        justify-content: space-between;
        padding: 16px 32px 24px 32px;
      }

      .has-plant-image .content {
        padding-bottom: 16px;
      }

      op-icon {
        color: var(--paper-item-icon-color);
        margin-bottom: 8px;
      }

      .attributes {
        cursor: pointer;
      }

      .attributes:focus {
        outline: none;
        background: var(--divider-color);
        border-radius: 100%;
      }

      .attributes div {
        text-align: center;
      }

      .problem {
        color: var(--google-red-500);
        font-weight: bold;
      }

      .uom {
        color: var(--secondary-text-color);
      }
    `;
  }

  private computeAttributes(stateObj: OppEntity): string[] {
    return Object.keys(SENSORS).filter((key) => key in stateObj.attributes);
  }

  private computeIcon(attr: string, batLvl: number): string {
    const icon = SENSORS[attr];
    if (attr === "battery") {
      if (batLvl <= 5) {
        return `${icon}-alert`;
      }
      if (batLvl < 95) {
        return `${icon}-${Math.round(batLvl / 10 - 0.01) * 10}`;
      }
    }
    return icon;
  }

  private _handleMoreInfo(ev: Event): void {
    const target = ev.currentTarget! as PlantAttributeTarget;
    const stateObj = this.opp!.states[this._config!.entity];

    if (target.value) {
      fireEvent(this, "opp-more-info", {
        entityId: stateObj.attributes.sensors[target.value],
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-plant-status-card": HuiPlantStatusCard;
  }
}
