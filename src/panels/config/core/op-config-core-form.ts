import {
  LitElement,
  customElement,
  property,
  TemplateResult,
  html,
  CSSResult,
  css,
} from "lit-element";
import "@material/mwc-button/mwc-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-radio-group/paper-radio-group";
import "@polymer/paper-radio-button/paper-radio-button";
import { OpenPeerPower } from "../../../types";
import "../../../components/op-card";
import { PolymerChangedEvent } from "../../../polymer-types";
// tslint:disable-next-line: no-duplicate-imports
import { PaperInputElement } from "@polymer/paper-input/paper-input";
import { UNIT_C } from "../../../common/const";
import { ConfigUpdateValues, saveCoreConfig } from "../../../data/core";
import { createTimezoneListEl } from "../../../components/timezone-datalist";

@customElement("op-config-core-form")
class ConfigCoreForm extends LitElement {
  @property() public opp!: OpenPeerPower;

  @property() private _working = false;

  @property() private _latitude!: string;
  @property() private _longitude!: string;
  @property() private _elevation!: string;
  @property() private _unitSystem!: ConfigUpdateValues["unit_system"];
  @property() private _timeZone!: string;

  protected render(): TemplateResult | void {
    const isStorage = this.opp.config.config_source === "storage";
    const disabled = this._working || !isStorage;

    return html`
      <op-card
        .header=${this.opp.localize(
          "ui.panel.config.core.section.core.form.heading"
        )}
      >
        <div class="card-content">
          ${!isStorage
            ? html`
                <p>
                  ${this.opp.localize(
                    "ui.panel.config.core.section.core.core_config.edit_requires_storage"
                  )}
                </p>
              `
            : ""}

          <div class="row">
            <paper-input
              class="flex"
              .label=${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.latitude"
              )}
              name="latitude"
              .disabled=${disabled}
              .value=${this._latitudeValue}
              @value-changed=${this._handleChange}
            ></paper-input>
            <paper-input
              class="flex"
              .label=${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.longitude"
              )}
              name="longitude"
              .disabled=${disabled}
              .value=${this._longitudeValue}
              @value-changed=${this._handleChange}
            ></paper-input>
          </div>

          <div class="row">
            <div class="flex">
              ${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.time_zone"
              )}
            </div>

            <paper-input
              class="flex"
              .label=${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.time_zone"
              )}
              name="timeZone"
              list="timezones"
              .disabled=${disabled}
              .value=${this._timeZoneValue}
              @value-changed=${this._handleChange}
            ></paper-input>
          </div>
          <div class="row">
            <div class="flex">
              ${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.elevation"
              )}
            </div>

            <paper-input
              class="flex"
              .label=${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.elevation"
              )}
              name="elevation"
              type="number"
              .disabled=${disabled}
              .value=${this._elevationValue}
              @value-changed=${this._handleChange}
            >
              <span slot="suffix">
                ${this.opp.localize(
                  "ui.panel.config.core.section.core.core_config.elevation_meters"
                )}
              </span>
            </paper-input>
          </div>

          <div class="row">
            <div class="flex">
              ${this.opp.localize(
                "ui.panel.config.core.section.core.core_config.unit_system"
              )}
            </div>
            <paper-radio-group class="flex" .selected=${this._unitSystemValue}>
              <paper-radio-button name="metric" .disabled=${disabled}>
                ${this.opp.localize(
                  "ui.panel.config.core.section.core.core_config.unit_system_metric"
                )}
                <div class="secondary">
                  ${this.opp.localize(
                    "ui.panel.config.core.section.core.core_config.metric_example"
                  )}
                </div>
              </paper-radio-button>
              <paper-radio-button name="imperial" .disabled=${disabled}>
                ${this.opp.localize(
                  "ui.panel.config.core.section.core.core_config.unit_system_imperial"
                )}
                <div class="secondary">
                  ${this.opp.localize(
                    "ui.panel.config.core.section.core.core_config.imperial_example"
                  )}
                </div>
              </paper-radio-button>
            </paper-radio-group>
          </div>
        </div>
        <div class="card-actions">
          <mwc-button @click=${this._save} .disabled=${disabled}>
            ${this.opp.localize(
              "ui.panel.config.core.section.core.core_config.save_button"
            )}
          </mwc-button>
        </div>
      </op-card>
    `;
  }

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    const input = this.shadowRoot!.querySelector(
      "[name=timeZone]"
    ) as PaperInputElement;
    input.inputElement.appendChild(createTimezoneListEl());
  }

  private get _latitudeValue() {
    return this._latitude !== undefined
      ? this._latitude
      : this.opp.config.latitude;
  }

  private get _longitudeValue() {
    return this._longitude !== undefined
      ? this._longitude
      : this.opp.config.longitude;
  }

  private get _elevationValue() {
    return this._elevation !== undefined
      ? this._elevation
      : this.opp.config.elevation;
  }

  private get _timeZoneValue() {
    return this._timeZone !== undefined
      ? this._timeZone
      : this.opp.config.time_zone;
  }

  private get _unitSystemValue() {
    return this._unitSystem !== undefined
      ? this._unitSystem
      : this.opp.config.unit_system.temperature === UNIT_C
      ? "metric"
      : "imperial";
  }

  private _handleChange(ev: PolymerChangedEvent<string>) {
    const target = ev.currentTarget as PaperInputElement;
    this[`_${target.name}`] = target.value;
  }

  private async _save() {
    this._working = true;
    try {
      await saveCoreConfig(this.opp, {
        latitude: Number(this._latitudeValue),
        longitude: Number(this._longitudeValue),
        elevation: Number(this._elevationValue),
        unit_system: this._unitSystemValue,
        time_zone: this._timeZoneValue,
      });
    } catch (err) {
      alert("FAIL");
    } finally {
      this._working = false;
    }
  }

  static get styles(): CSSResult {
    return css`
      .row {
        display: flex;
        flex-direction: row;
        margin: 0 -8px;
        align-items: center;
      }

      .secondary {
        color: var(--secondary-text-color);
      }

      .flex {
        flex: 1;
      }

      .row > * {
        margin: 0 8px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-config-core-form": ConfigCoreForm;
  }
}
