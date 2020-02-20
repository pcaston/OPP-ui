import "../../../components/buttons/op-call-service-button";
import "../../../components/op-service-description";
import "../../../components/op-card";
import "../op-config-section";
import "./zop-clusters";
import "./zop-device-card";
import "@material/mwc-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";

import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from "lit-element";

import { fireEvent } from "../../../common/dom/fire_event";
import { fetchDevices, ZHADevice } from "../../../data/zha";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import { sortZHADevices } from "./functions";
import { ItemSelectedEvent, ZHADeviceRemovedEvent } from "./types";

declare global {
  // for fire event
  interface OPPDomEvents {
    "zop-node-selected": {
      node?: ZHADevice;
    };
  }
}

@customElement("zop-node")
export class ZHANode extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public isWide?: boolean;
  @property() private _showHelp: boolean = false;
  @property() private _selectedDeviceIndex: number = -1;
  @property() private _selectedDevice?: ZHADevice;
  @property() private _nodes: ZHADevice[] = [];

  public connectedCallback(): void {
    super.connectedCallback();
    this._fetchDevices();
  }

  protected render(): TemplateResult | void {
    return html`
      <op-config-section .isWide="${this.isWide}">
        <div class="sectionHeader" slot="header">
          <span>Device Management</span>
          <paper-icon-button
            class="toggle-help-icon"
            @click="${this._onHelpTap}"
            icon="opp:help-circle"
          ></paper-icon-button>
        </div>
        <span slot="introduction">
          Run ZHA commands that affect a single device. Pick a device to see a
          list of available commands. <br /><br />Note: Sleepy (battery powered)
          devices need to be awake when executing commands against them. You can
          generally wake a sleepy device by triggering it. <br /><br />Some
          devices such as Xiaomi sensors have a wake up button that you can
          press at ~5 second intervals that keep devices awake while you
          interact with them.
        </span>
        <op-card class="content">
          <div class="node-picker">
            <paper-dropdown-menu
              label="Devices"
              class="flex"
              id="zop-device-selector"
            >
              <paper-listbox
                slot="dropdown-content"
                @iron-select="${this._selectedDeviceChanged}"
                .selected="${this._selectedDeviceIndex}"
              >
                ${this._nodes.map(
                  (entry) => html`
                    <paper-item
                      >${entry.user_given_name
                        ? entry.user_given_name
                        : entry.name}</paper-item
                    >
                  `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          ${this._showHelp
            ? html`
                <div class="help-text">
                  Select device to view per-device options
                </div>
              `
            : ""}
          ${this._selectedDeviceIndex !== -1
            ? html`
                <zop-device-card
                  class="card"
                  .opp="${this.opp}"
                  .device="${this._selectedDevice}"
                  .narrow="${!this.isWide}"
                  .showHelp="${this._showHelp}"
                  .showActions="${true}"
                  @zop-device-removed="${this._onDeviceRemoved}"
                  .isJoinPage="${false}"
                ></zop-device-card>
              `
            : ""}
          ${this._selectedDevice ? this._renderClusters() : ""}
        </op-card>
      </op-config-section>
    `;
  }

  private _renderClusters(): TemplateResult {
    return html`
      <zop-clusters
        .opp="${this.opp}"
        .selectedDevice="${this._selectedDevice}"
        .showHelp="${this._showHelp}"
      ></zop-clusters>
    `;
  }

  private _onHelpTap(): void {
    this._showHelp = !this._showHelp;
  }

  private _selectedDeviceChanged(event: ItemSelectedEvent): void {
    this._selectedDeviceIndex = event!.target!.selected;
    this._selectedDevice = this._nodes[this._selectedDeviceIndex];
    fireEvent(this, "zop-node-selected", { node: this._selectedDevice });
  }

  private async _fetchDevices() {
    this._nodes = (await fetchDevices(this.opp!)).sort(sortZHADevices);
  }

  private _onDeviceRemoved(event: ZHADeviceRemovedEvent): void {
    this._selectedDeviceIndex = -1;
    this._nodes.splice(this._nodes.indexOf(event.detail!.device!), 1);
    this._selectedDevice = undefined;
    fireEvent(this, "zop-node-selected", { node: this._selectedDevice });
  }

  static get styles(): CSSResult[] {
    return [
      opStyle,
      css`
        .flex {
          -ms-flex: 1 1 0.000000001px;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-basis: 0.000000001px;
          flex-basis: 0.000000001px;
        }

        .content {
          margin-top: 24px;
        }

        .node-info {
          margin-left: 16px;
        }

        .sectionHeader {
          position: relative;
        }

        .help-text {
          color: grey;
          padding-left: 28px;
          padding-right: 28px;
          padding-bottom: 16px;
        }

        op-card {
          margin: 0 auto;
          max-width: 600px;
        }

        .node-picker {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          padding-left: 28px;
          padding-right: 28px;
          padding-bottom: 10px;
        }

        .card {
          box-sizing: border-box;
          display: flex;
          flex: 1 0 300px;
          min-width: 0;
          max-width: 600px;
          padding-left: 28px;
          padding-right: 28px;
          padding-bottom: 10px;
          word-wrap: break-word;
        }

        op-service-description {
          display: block;
          color: grey;
        }

        [hidden] {
          display: none;
        }

        .toggle-help-icon {
          position: absolute;
          top: 6px;
          right: 0;
          color: var(--primary-color);
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zop-node": ZHANode;
  }
}
