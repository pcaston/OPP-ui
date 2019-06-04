import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
} from "lit-element";

import "../../../../components/entity/op-entity-picker";

import { struct } from "../../common/structs/struct";
import { EntitiesEditorEvent, EditorTarget } from "../types";
import { OpenPeerPower } from "../../../../types";
import { LovelaceCardEditor } from "../../types";
import { fireEvent } from "../../../../common/dom/fire_event";
import { configElementStyle } from "./config-elements-style";
import { WeatherForecastCardConfig } from "../../cards/types";

const cardConfigStruct = struct({
  type: "string",
  entity: "string?",
  name: "string?",
});

@customElement("hui-weather-forecast-card-editor")
export class HuiWeatherForecastCardEditor extends LitElement
  implements LovelaceCardEditor {
  @property() public opp?: OpenPeerPower;

  @property() private _config?: WeatherForecastCardConfig;

  public setConfig(config: WeatherForecastCardConfig): void {
    config = cardConfigStruct(config);
    this._config = config;
  }

  get _entity(): string {
    return this._config!.entity || "";
  }

  get _name(): string {
    return this._config!.name || "";
  }

  protected render(): TemplateResult | void {
    if (!this.opp) {
      return html``;
    }

    return html`
      ${configElementStyle}
      <div class="card-config">
        <div class="side-by-side">
          <paper-input
            label="Name"
            .value="${this._name}"
            .configValue="${"name"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
          <op-entity-picker
            .opp="${this.opp}"
            .value="${this._entity}"
            .configValue=${"entity"}
            domain-filter="weather"
            @change="${this._valueChanged}"
            allow-custom-entity
          ></op-entity-picker>
        </div>
      </div>
    `;
  }

  private _valueChanged(ev: EntitiesEditorEvent): void {
    if (!this._config || !this.opp) {
      return;
    }
    const target = ev.target! as EditorTarget;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue!];
      } else {
        this._config = {
          ...this._config,
          [target.configValue!]: target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-weather-forecast-card-editor": HuiWeatherForecastCardEditor;
  }
}
