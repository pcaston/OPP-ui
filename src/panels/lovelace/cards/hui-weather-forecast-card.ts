import {
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
  css,
  CSSResult,
  property,
  customElement,
} from "lit-element";

import "../../../components/op-card";
import "../components/hui-warning";

import { isValidEntityId } from "../../../common/entity/valid_entity_id";
import { computeStateName } from "../../../common/entity/compute_state_name";

import { OpenPeerPower } from "../../../types";
import { hasConfigOrEntityChanged } from "../common/has-changed";
import { LovelaceCard, LovelaceCardEditor } from "../types";
import { WeatherForecastCardConfig } from "./types";
import { computeRTL } from "../../../common/util/compute_rtl";
import { fireEvent } from "../../../common/dom/fire_event";
import { toggleAttribute } from "../../../common/dom/toggle_attribute";
import { applyThemesOnElement } from "../../../common/dom/apply_themes_on_element";

const cardinalDirections = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
  "N",
];

const weatherIcons = {
  "clear-night": "opp:weather-night",
  cloudy: "opp:weather-cloudy",
  exceptional: "opp:alert-circle-outline",
  fog: "opp:weather-fog",
  hail: "opp:weather-hail",
  lightning: "opp:weather-lightning",
  "lightning-rainy": "opp:weather-lightning-rainy",
  partlycloudy: "opp:weather-partly-cloudy",
  pouring: "opp:weather-pouring",
  rainy: "opp:weather-rainy",
  snowy: "opp:weather-snowy",
  "snowy-rainy": "opp:weather-snowy-rainy",
  sunny: "opp:weather-sunny",
  windy: "opp:weather-windy",
  "windy-variant": "opp:weather-windy-variant",
};

@customElement("hui-weather-forecast-card")
class HuiWeatherForecastCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(
      /* webpackChunkName: "hui-weather-forecast-card-editor" */ "../editor/config-elements/hui-weather-forecast-card-editor"
    );
    return document.createElement("hui-weather-forecast-card-editor");
  }
  public static getStubConfig(): object {
    return { entity: "" };
  }

  @property() public opp?: OpenPeerPower;

  @property() private _config?: WeatherForecastCardConfig;

  public getCardSize(): number {
    return 4;
  }

  public setConfig(config: WeatherForecastCardConfig): void {
    if (!config || !config.entity) {
      throw new Error("Invalid card configuration");
    }
    if (!isValidEntityId(config.entity)) {
      throw new Error("Invalid Entity");
    }

    this._config = config;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this._config || !this.opp) {
      return;
    }
    const oldOpp = changedProps.get("opp") as OpenPeerPower | undefined;
    const oldConfig = changedProps.get("_config") as
      | WeatherForecastCardConfig
      | undefined;

    if (
      !oldOpp ||
      !oldConfig ||
      oldOpp.themes !== this.opp.themes ||
      oldConfig.theme !== this._config.theme
    ) {
      applyThemesOnElement(this, this.opp.themes, this._config.theme);
    }

    if (changedProps.has("opp")) {
      toggleAttribute(this, "rtl", computeRTL(this.opp!));
    }
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }

    const stateObj = this.opp.states[this._config.entity];

    if (!stateObj) {
      return html`
        <hui-warning
          >${this.opp.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this._config.entity
          )}</hui-warning
        >
      `;
    }

    const forecast = stateObj.attributes.forecast
      ? stateObj.attributes.forecast.slice(0, 5)
      : undefined;

    return html`
      <op-card @click="${this.handleClick}">
        <div class="header">
          ${this.opp.localize(`state.weather.${stateObj.state}`) ||
            stateObj.state}
          <div class="name">
            ${(this._config && this._config.name) || computeStateName(stateObj)}
          </div>
        </div>
        <div class="content">
          <div class="now">
            <div class="main">
              ${stateObj.state in weatherIcons
                ? html`
                    <op-icon icon="${weatherIcons[stateObj.state]}"></op-icon>
                  `
                : ""}
              <div class="temp">
                ${stateObj.attributes.temperature}<span
                  >${this.getUnit("temperature")}</span
                >
              </div>
            </div>
            <div class="attributes">
              ${this._showValue(stateObj.attributes.pressure)
                ? html`
                    <div>
                      ${this.opp.localize(
                        "ui.card.weather.attributes.air_pressure"
                      )}:
                      <span class="measurand">
                        ${stateObj.attributes.pressure}
                        ${this.getUnit("air_pressure")}
                      </span>
                    </div>
                  `
                : ""}
              ${this._showValue(stateObj.attributes.humidity)
                ? html`
                    <div>
                      ${this.opp.localize(
                        "ui.card.weather.attributes.humidity"
                      )}:
                      <span class="measurand"
                        >${stateObj.attributes.humidity} %</span
                      >
                    </div>
                  `
                : ""}
              ${this._showValue(stateObj.attributes.wind_speed)
                ? html`
                    <div>
                      ${this.opp.localize(
                        "ui.card.weather.attributes.wind_speed"
                      )}:
                      <span class="measurand">
                        ${stateObj.attributes.wind_speed}
                        ${this.getUnit("length")}/h
                      </span>
                      ${this.getWindBearing(stateObj.attributes.wind_bearing)}
                    </div>
                  `
                : ""}
            </div>
          </div>
          ${forecast
            ? html`
                <div class="forecast">
                  ${forecast.map(
                    (item) => html`
                      <div>
                        <div class="weekday">
                          ${new Date(item.datetime).toLocaleDateString(
                            this.opp!.language,
                            { weekday: "short" }
                          )}<br />
                          ${!this._showValue(item.templow)
                            ? html`
                                ${new Date(item.datetime).toLocaleTimeString(
                                  this.opp!.language,
                                  {
                                    hour: "numeric",
                                  }
                                )}
                              `
                            : ""}
                        </div>
                        ${this._showValue(item.condition)
                          ? html`
                              <div class="icon">
                                <op-icon
                                  .icon="${weatherIcons[item.condition]}"
                                ></op-icon>
                              </div>
                            `
                          : ""}
                        ${this._showValue(item.temperature)
                          ? html`
                              <div class="temp">
                                ${item.temperature}
                                ${this.getUnit("temperature")}
                              </div>
                            `
                          : ""}
                        ${this._showValue(item.templow)
                          ? html`
                              <div class="templow">
                                ${item.templow} ${this.getUnit("temperature")}
                              </div>
                            `
                          : ""}
                        ${this._showValue(item.precipitation)
                          ? html`
                              <div class="precipitation">
                                ${item.precipitation}
                                ${this.getUnit("precipitation")}
                              </div>
                            `
                          : ""}
                      </div>
                    `
                  )}
                </div>
              `
            : ""}
        </div>
      </op-card>
    `;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  private handleClick(): void {
    fireEvent(this, "opp-more-info", { entityId: this._config!.entity });
  }

  private getUnit(measure: string): string {
    const lengthUnit = this.opp!.config.unit_system.length || "";
    switch (measure) {
      case "air_pressure":
        return lengthUnit === "km" ? "hPa" : "inHg";
      case "length":
        return lengthUnit;
      case "precipitation":
        return lengthUnit === "km" ? "mm" : "in";
      default:
        return this.opp!.config.unit_system[measure] || "";
    }
  }

  private windBearingToText(degree: string): string {
    const degreenum = parseInt(degree, 10);
    if (isFinite(degreenum)) {
      // tslint:disable-next-line: no-bitwise
      return cardinalDirections[(((degreenum + 11.25) / 22.5) | 0) % 16];
    }
    return degree;
  }

  private getWindBearing(bearing: string): string {
    if (bearing != null) {
      const cardinalDirection = this.windBearingToText(bearing);
      return `(${this.opp!.localize(
        `ui.card.weather.cardinal_direction.${cardinalDirection.toLowerCase()}`
      ) || cardinalDirection})`;
    }
    return ``;
  }

  private _showValue(item: string): boolean {
    return typeof item !== "undefined" && item !== null;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        cursor: pointer;
      }

      .content {
        padding: 0 20px 20px;
      }

      op-icon {
        color: var(--paper-item-icon-color);
      }

      .header {
        font-family: var(--paper-font-headline_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-headline_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-headline_-_font-size);
        font-weight: var(--paper-font-headline_-_font-weight);
        letter-spacing: var(--paper-font-headline_-_letter-spacing);
        line-height: var(--paper-font-headline_-_line-height);
        text-rendering: var(
          --paper-font-common-expensive-kerning_-_text-rendering
        );
        opacity: var(--dark-primary-opacity);
        padding: 24px 16px 16px;
        display: flex;
        align-items: baseline;
      }

      .name {
        margin-left: 16px;
        font-size: 16px;
        color: var(--secondary-text-color);
      }

      :host([rtl]) .name {
        margin-left: 0px;
        margin-right: 16px;
      }

      .now {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      }

      .main {
        display: flex;
        align-items: center;
        margin-right: 32px;
      }

      :host([rtl]) .main {
        margin-right: 0px;
      }

      .main op-icon {
        --iron-icon-height: 72px;
        --iron-icon-width: 72px;
        margin-right: 8px;
      }

      :host([rtl]) .main op-icon {
        margin-right: 0px;
      }

      .main .temp {
        font-size: 52px;
        line-height: 1em;
        position: relative;
      }

      :host([rtl]) .main .temp {
        direction: ltr;
        margin-right: 28px;
      }

      .main .temp span {
        font-size: 24px;
        line-height: 1em;
        position: absolute;
        top: 4px;
      }

      .measurand {
        display: inline-block;
      }

      :host([rtl]) .measurand {
        direction: ltr;
      }

      .forecast {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
      }

      .forecast div {
        flex: 0 0 auto;
        text-align: center;
      }

      .forecast .icon {
        margin: 4px 0;
        text-align: center;
      }

      :host([rtl]) .forecast .temp {
        direction: ltr;
      }

      .weekday {
        font-weight: bold;
      }

      .attributes,
      .templow,
      .precipitation {
        color: var(--secondary-text-color);
      }

      :host([rtl]) .precipitation {
        direction: ltr;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-weather-forecast-card": HuiWeatherForecastCard;
  }
}
