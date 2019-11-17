import {
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
  customElement,
  property,
  css,
  CSSResult,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";

import computeStateDisplay from "../../../common/entity/compute_state_display";
import computeStateName from "../../../common/entity/compute_state_name";
import applyThemesOnElement from "../../../common/dom/apply_themes_on_element";

import "../../../components/entity/state-badge";
import "../../../components/op-card";
import "../../../components/opp-icon";
import "../components/hui-warning-element";

import { OpenPeerPower } from "../../../types";
import { LovelaceCard, LovelaceCardEditor } from "../types";
import { longPress } from "../common/directives/long-press-directive";
import { processConfigEntities } from "../common/process-config-entities";
import { handleClick } from "../common/handle-click";
import { GlanceCardConfig, ConfigEntity } from "./types";

@customElement("hui-glance-card")
export class HuiGlanceCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(/* webpackChunkName: "hui-glance-card-editor" */ "../editor/config-elements/hui-glance-card-editor");
    return document.createElement("hui-glance-card-editor");
  }

  public static getStubConfig(): object {
    return { entities: [] };
  }

  @property() public opp?: OpenPeerPower;

  @property() private _config?: GlanceCardConfig;

  private _configEntities?: ConfigEntity[];

  public getCardSize(): number {
    return (
      (this._config!.title ? 1 : 0) +
      Math.ceil(this._configEntities!.length / 5)
    );
  }

  public setConfig(config: GlanceCardConfig): void {
    this._config = { theme: "default", ...config };
    const entities = processConfigEntities<ConfigEntity>(config.entities);

    for (const entity of entities) {
      if (
        (entity.tap_action &&
          entity.tap_action.action === "call-service" &&
          !entity.tap_action.service) ||
        (entity.hold_action &&
          entity.hold_action.action === "call-service" &&
          !entity.hold_action.service)
      ) {
        throw new Error(
          'Missing required property "service" when tap_action or hold_action is call-service'
        );
      }
    }

    const columns = config.columns || Math.min(config.entities.length, 5);
    this.style.setProperty("--glance-column-width", `${100 / columns}%`);

    this._configEntities = entities;

    if (this.opp) {
      this.requestUpdate();
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config")) {
      return true;
    }

    const oldOpp = changedProps.get("opp") as OpenPeerPower | undefined;
    if (oldOpp && this._configEntities) {
      for (const entity of this._configEntities) {
        if (
          oldOpp.states[entity.entity] !== this.opp!.states[entity.entity]
        ) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.opp) {
      return html``;
    }
    const { title } = this._config;

    return html`
      <op-card .header="${title}">
        <div class="${classMap({ entities: true, "no-header": !title })}">
          ${this._configEntities!.map((entityConf) =>
            this.renderEntity(entityConf)
          )}
        </div>
      </op-card>
    `;
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this._config || !this.opp) {
      return;
    }

    const oldOpp = changedProperties.get("opp") as OpenPeerPower | undefined;
    if (!oldOpp || oldOpp.themes !== this.opp.themes) {
      applyThemesOnElement(this, this.opp.themes, this._config.theme);
    }
  }

  static get styles(): CSSResult {
    return css`
      .entities {
        display: flex;
        padding: 0 16px 4px;
        flex-wrap: wrap;
      }
      .entities.no-header {
        padding-top: 16px;
      }
      .entity {
        box-sizing: border-box;
        padding: 0 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        margin-bottom: 12px;
        width: var(--glance-column-width, 20%);
      }
      .entity div {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .name {
        min-height: var(--paper-font-body1_-_line-height, 20px);
      }
      state-badge {
        margin: 8px 0;
      }
    `;
  }

  private renderEntity(entityConf): TemplateResult {
    const stateObj = this.opp!.states[entityConf.entity];

    if (!stateObj) {
      return html`
        <hui-warning-element
          label=${this.opp!.localize(
            "ui.panel.lovelace.warning.entity_not_found",
            "entity",
            entityConf.entity
          )}
        ></hui-warning-element>
      `;
    }

    return html`
      <div
        class="entity"
        .entityConf="${entityConf}"
        @op-click="${this._handleTap}"
        @op-hold="${this._handleHold}"
        .longPress="${longPress()}"
      >
        ${this._config!.show_name !== false
          ? html`
              <div class="name">
                ${"name" in entityConf
                  ? entityConf.name
                  : computeStateName(stateObj)}
              </div>
            `
          : ""}
        ${this._config!.show_icon !== false
          ? html`
              <state-badge
                .stateObj="${stateObj}"
                .overrideIcon="${entityConf.icon}"
              ></state-badge>
            `
          : ""}
        ${this._config!.show_state !== false
          ? html`
              <div>
                ${computeStateDisplay(
                  stateObj
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }

  private _handleTap(ev: MouseEvent): void {
    const config = (ev.currentTarget as any).entityConf as ConfigEntity;
    handleClick(this, this.opp!, config, false);
  }

  private _handleHold(ev: MouseEvent): void {
    const config = (ev.currentTarget as any).entityConf as ConfigEntity;
    handleClick(this, this.opp!, config, true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-glance-card": HuiGlanceCard;
  }
}
