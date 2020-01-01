import {
  LitElement,
  html,
  CSSResult,
  css,
  PropertyValues,
  property,
} from "lit-element";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";
import "./op-icon";

import "../components/user/op-user-badge";
import isComponentLoaded from "../common/config/is_component_loaded";
import { OpenPeerPower, PanelInfo } from "../types";
import { fireEvent } from "../common/dom/fire_event";
import { DEFAULT_PANEL } from "../common/const";
import {
  getExternalConfig,
  ExternalConfig,
} from "../external_app/external_config";

const computeUrl = (urlPath) => `/${urlPath}`;

const computePanels = (opp: OpenPeerPower) => {
  const panels = opp.panels;
  if (!panels) {
    return [];
  }

  const sortValue = {
    map: 1,
    logbook: 2,
    history: 3,
  };
  const result: PanelInfo[] = Object.values(panels).filter(
    (panel) => panel.title
  );

  result.sort((a, b) => {
    const aBuiltIn = a.component_name in sortValue;
    const bBuiltIn = b.component_name in sortValue;

    if (aBuiltIn && bBuiltIn) {
      return sortValue[a.component_name] - sortValue[b.component_name];
    }
    if (aBuiltIn) {
      return -1;
    }
    if (bBuiltIn) {
      return 1;
    }
    // both not built in, sort by title
    if (a.title! < b.title!) {
      return -1;
    }
    if (a.title! > b.title!) {
      return 1;
    }
    return 0;
  });

  return result;
};

/*
 * @appliesMixin LocalizeMixin
 */
class OpSidebar extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public _defaultPage?: string =
    localStorage.defaultPage || DEFAULT_PANEL;
  @property() private _externalConfig?: ExternalConfig;

  protected render() {
    const opp = this.opp;

    if (!opp) {
      return html``;
    }

    return html`
      <app-toolbar>
        <div main-title>Open Peer Power</div>
        ${opp.user
          ? html`
              <a href="/profile">
                <op-user-badge .user=${opp.user}></op-user-badge>
              </a>
            `
          : ""}
      </app-toolbar>

      <paper-listbox attr-for-selected="data-panel" .selected=${opp.panelUrl}>
        <a
          href="${computeUrl(this._defaultPage)}"
          data-panel=${this._defaultPage}
          tabindex="-1"
        >
          <paper-icon-item>
            <op-icon slot="item-icon" icon="opp:apps"></op-icon>
            <span class="item-text">${opp.localize("panel.states")}</span>
          </paper-icon-item>
        </a>

        ${computePanels(opp).map(
          (panel) => html`
            <a
              href="${computeUrl(panel.url_path)}"
              data-panel="${panel.url_path}"
              tabindex="-1"
            >
              <paper-icon-item>
                <op-icon slot="item-icon" .icon="${panel.icon}"></op-icon>
                <span class="item-text"
                  >${opp.localize(`panel.${panel.title}`) || panel.title}</span
                >
              </paper-icon-item>
            </a>
          `
        )}
        ${this._externalConfig && this._externalConfig.hasSettingsScreen
          ? html`
              <a
                aria-label="App Configuration"
                href="#external-app-configuration"
                tabindex="-1"
                @click=${this._handleExternalAppConfiguration}
              >
                <paper-icon-item>
                  <op-icon
                    slot="item-icon"
                    icon="opp:cellphone-settings-variant"
                  ></op-icon>
                  <span class="item-text"
                    >${opp.localize(
                      "ui.sidebar.external_app_configuration"
                    )}</span
                  >
                </paper-icon-item>
              </a>
            `
          : ""}
        ${!opp.user
          ? html`
              <paper-icon-item @click=${this._handleLogOut} class="logout">
                <op-icon slot="item-icon" icon="opp:exit-to-app"></op-icon>
                <span class="item-text"
                  >${opp.localize("ui.sidebar.log_out")}</span
                >
              </paper-icon-item>
            `
          : html``}
      </paper-listbox>

      ${opp.user && opp.user.is_admin
        ? html`
            <div>
              <div class="divider"></div>

              <div class="subheader">
                ${opp.localize("ui.sidebar.developer_tools")}
              </div>

              <div class="dev-tools">
                <a href="/dev-service" tabindex="-1">
                  <paper-icon-button
                    icon="opp:remote"
                    alt="${opp.localize("panel.dev-services")}"
                    title="${opp.localize("panel.dev-services")}"
                  ></paper-icon-button>
                </a>
                <a href="/dev-state" tabindex="-1">
                  <paper-icon-button
                    icon="opp:code-tags"
                    alt="${opp.localize("panel.dev-states")}"
                    title="${opp.localize("panel.dev-states")}"
                  ></paper-icon-button>
                </a>
                <a href="/dev-event" tabindex="-1">
                  <paper-icon-button
                    icon="opp:radio-tower"
                    alt="${opp.localize("panel.dev-events")}"
                    title="${opp.localize("panel.dev-events")}"
                  ></paper-icon-button>
                </a>
                <a href="/dev-template" tabindex="-1">
                  <paper-icon-button
                    icon="opp:file-xml"
                    alt="${opp.localize("panel.dev-templates")}"
                    title="${opp.localize("panel.dev-templates")}"
                  ></paper-icon-button>
                </a>
                ${isComponentLoaded(opp, "mqtt")
                  ? html`
                      <a href="/dev-mqtt" tabindex="-1">
                        <paper-icon-button
                          icon="opp:altimeter"
                          alt="${opp.localize("panel.dev-mqtt")}"
                          title="${opp.localize("panel.dev-mqtt")}"
                        ></paper-icon-button>
                      </a>
                    `
                  : html``}
                <a href="/dev-info" tabindex="-1">
                  <paper-icon-button
                    icon="opp:information-outline"
                    alt="${opp.localize("panel.dev-info")}"
                    title="${opp.localize("panel.dev-info")}"
                  ></paper-icon-button>
                </a>
              </div>
            </div>
          `
        : ""}
    `;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_externalConfig")) {
      return true;
    }
    if (!this.opp || !changedProps.has("opp")) {
      return false;
    }
    const oldOpp = changedProps.get("opp") as OpenPeerPower;
    if (!oldOpp) {
      return true;
    }
    const opp = this.opp;
    return (
      opp.panels !== oldOpp.panels ||
      opp.panelUrl !== oldOpp.panelUrl ||
      opp.config.components !== oldOpp.config.components ||
      opp.user !== oldOpp.user ||
      opp.localize !== oldOpp.localize
    );
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    if (this.opp && this.opp.auth.external) {
      getExternalConfig(this.opp.auth.external).then((conf) => {
        this._externalConfig = conf;
      });
    }
  }

  private _handleLogOut() {
    fireEvent(this, "opp-logout");
  }

  private _handleExternalAppConfiguration(ev: Event) {
    ev.preventDefault();
    this.opp!.auth.external!.fireMessage({
      type: "config_screen/show",
    });
  }

  static get styles(): CSSResult {
    return css`
      :host {
        height: 100%;
        display: block;
        overflow: auto;
        -ms-user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        border-right: 1px solid var(--divider-color);
        background-color: var(
          --sidebar-background-color,
          var(--primary-background-color)
        );
      }

      app-toolbar {
        font-weight: 400;
        color: var(--primary-text-color);
        border-bottom: 1px solid var(--divider-color);
        background-color: var(--primary-background-color);
      }

      app-toolbar a {
        color: var(--primary-text-color);
      }

      paper-listbox {
        padding: 0;
      }

      paper-listbox > a {
        color: var(--sidebar-text-color);
        font-weight: 500;
        font-size: 14px;
        text-decoration: none;
      }

      paper-icon-item {
        margin: 8px;
        padding-left: 9px;
        border-radius: 4px;
        --paper-item-min-height: 40px;
      }

      op-icon[slot="item-icon"] {
        color: var(--sidebar-icon-color);
      }

      .iron-selected paper-icon-item:before {
        border-radius: 4px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        content: "";
        background-color: var(--sidebar-selected-icon-color);
        opacity: 0.12;
        transition: opacity 15ms linear;
        will-change: opacity;
      }

      .iron-selected paper-icon-item[pressed]:before {
        opacity: 0.37;
      }

      paper-icon-item span {
        color: var(--sidebar-text-color);
        font-weight: 500;
        font-size: 14px;
      }

      a.iron-selected paper-icon-item op-icon {
        color: var(--sidebar-selected-icon-color);
      }

      a.iron-selected .item-text {
        color: var(--sidebar-selected-text-color);
      }

      paper-icon-item.logout {
        margin-top: 16px;
      }

      .divider {
        height: 1px;
        background-color: var(--divider-color);
        margin: 4px 0;
      }

      .subheader {
        color: var(--sidebar-text-color);
        font-weight: 500;
        font-size: 14px;
        padding: 16px;
      }

      .dev-tools {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 8px;
      }

      .dev-tools a {
        color: var(--sidebar-icon-color);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-sidebar": OpSidebar;
  }
}

customElements.define("op-sidebar", OpSidebar);
