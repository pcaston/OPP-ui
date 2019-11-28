import "@polymer/iron-icon/iron-icon";
import { OpenPeerPower, OppEntities} from "../../../types";
import {
  LitElement,
  css,
  html,
  property,
  customElement,
  TemplateResult,
} from "lit-element";

/*
 */
@customElement("more-info-weather")
export class MoreInfoWeather extends LitElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) stateObj!: OppEntities;
  @property({ type : Array }) cardinalDirections = [
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
  @property({ type : Object }) weatherIcons = {
    "clear-night": "opp:weather-night",
    cloudy: "opp:weather-cloudy",
    fog: "opp:weather-fog",
    hail: "opp:weather-hail",
    lightning: "opp:weather-lightning",
    "lightning-rainy": "opp:weather-lightning-rainy",
    partlycloudy: "opp:weather-partlycloudy",
    pouring: "opp:weather-pouring",
    rainy: "opp:weather-rainy",
    snowy: "opp:weather-snowy",
    "snowy-rainy": "opp:weather-snowy-rainy",
    sunny: "opp:weather-sunny",
    windy: "opp:weather-windy",
    "windy-variant": "opp:weather-windy-variant",
  };

  static get styles() {
    return [
      css`
        iron-icon {
          color: var(--paper-item-icon-color);
        }
        .section {
          margin: 16px 0 8px 0;
          font-size: 1.2em;
        }
        .flex {
          display: flex;
          height: 32px;
          align-items: center;
        }
        .main {
          flex: 1;
          margin-left: 24px;
        }
        .temp,
        .templow {
          min-width: 48px;
          text-align: right;
        }
        .templow {
          margin: 0 16px;
          color: var(--secondary-text-color);
        }
        .attribution {
          color: var(--secondary-text-color);
          text-align: center;
        }
      `
    ];
  }
  
  protected render(): TemplateResult | void  {
    return html`
      <div class="flex">
        <iron-icon icon="opp:thermometer"></iron-icon>
        <div class="main">
          'ui.card.weather.attributes.temperature'
        </div>
        <div>
          ${this.stateObj.attributes.temperature} ${this.getUnit('temperature')}
        </div>
      </div>
      <div class="flex"
        ?active="${this._showValue(this.stateObj.attributes.pressure)}"
      >
        <iron-icon icon="opp:gauge"></iron-icon>
        <div class="main">
          'ui.card.weather.attributes.air_pressure'
        </div>
        <div>
          ${this.stateObj.attributes.pressure} ${this.getUnit('air_pressure')}
        </div>
      </div>
      <div class="flex"
        ?active="${this._showValue(this.stateObj.attributes.humidity)}"
      >
        <iron-icon icon="opp:water-percent"></iron-icon>
        <div class="main">
          'ui.card.weather.attributes.humidity'
        </div>
        <div>${this.stateObj.attributes.humidity} %</div>
      </div>

      <div class="flex"
        ?active="${this._showValue(this.stateObj.attributes.wind_speed)}"
      >
        <iron-icon icon="opp:weather-windy"></iron-icon>
        <div class="main">
          'ui.card.weather.attributes.wind_speed'
        </div>
        <div>
          ${this.getWind(this.stateObj.attributes.wind_speed,
          this.stateObj.attributes.wind_bearing)}
        </div>
      </div>

      <div class="flex"
        ?active="${this._showValue(this.stateObj.attributes.visibility)}"
      >
        <iron-icon icon="opp:eye"></iron-icon>
        <div class="main">
          'ui.card.weather.attributes.visibility'
        </div>
        <div>${this.stateObj.attributes.visibility} ${this.getUnit('length')}</div>
      </div>

      <div class="flex"
      ?active="${this.stateObj.attributes.forecast}"
      >
        <div class="section">'ui.card.weather.forecast'</div>
        ${Object.keys(this.stateObj!.attributes.forecast).map((key) => {
          const item: forecast = this.stateObj!.attributes.forecast[key];
          return html`
          <div class="flex">
              <iron-icon
                icon="${this.getWeatherIcon(item.condition)}"
                ?active="${this._showValue(this._showValue(item.condition))}"
              ></iron-icon>
              <div class="main">${this._showValue(item.templow)}</div>

              <div class="main"
                ?active="${this._showValue(this._showValue(item.templow))}"
              >${this.computeDate(item.datetime)}</div>
              <div class="templow">
                ${this.item.templow} ${this.getUnit('temperature')}
              </div>

            <div class="temp">
              ${item.temperature} ${this.getUnit('temperature')}
            </div>
          </div>
      </div>
      <div class="attribution"
        ?active="${this.stateObj.attributes.attribution}"
      >${this.stateObj.attributes.attribution}</div>
    `;
  };

  computeDate(data) {
    const date = new Date(data);
    return date.toLocaleDateString(this.opp.language, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  computeDateTime(data) {
    const date = new Date(data);
    return date.toLocaleDateString(this.opp.language, {
      weekday: "long",
      hour: "numeric",
    });
  }

  getUnit(measure) {
    const lengthUnit = this.opp.config.unit_system.length || "";
    switch (measure) {
      case "air_pressure":
        return lengthUnit === "km" ? "hPa" : "inHg";
      case "length":
        return lengthUnit;
      case "precipitation":
        return lengthUnit === "km" ? "mm" : "in";
      default:
        return this.opp.config.unit_system[measure] || "";
    }
  }

  windBearingToText(degree) {
    const degreenum = parseInt(degree);
    if (isFinite(degreenum)) {
      return this.cardinalDirections[(((degreenum + 11.25) / 22.5) | 0) % 16];
    }
    return degree;
  }

  getWind(speed, bearing) {
    if (bearing != null) {
      const cardinalDirection = this.windBearingToText(bearing);
      return `${speed} ${this.getUnit("length")}/h (${
        `ui.card.weather.cardinal_direction.${cardinalDirection.toLowerCase()}`
      ) || cardinalDirection}`;
    }
    return `${speed} ${this.getUnit("length")}/h`;
  }

  getWeatherIcon(condition) {
    return this.weatherIcons[condition];
  }

  _showValue(item) {
    return typeof item !== "undefined" && item !== null;
  }
}