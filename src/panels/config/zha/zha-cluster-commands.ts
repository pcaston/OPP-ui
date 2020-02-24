import "../../../components/buttons/op-call-service-button";
import "../../../components/op-service-description";
import "../../../components/op-card";
import "../op-config-section";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";

import {
  css,
  CSSResult,
  html,
  LitElement,
  PropertyDeclarations,
  PropertyValues,
  TemplateResult,
} from "lit-element";

import {
  Cluster,
  Command,
  fetchCommandsForCluster,
  ZHADevice,
} from "../../../data/zha";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import { formatAsPaddedHex } from "./functions";
import {
  ChangeEvent,
  IssueCommandServiceData,
  ItemSelectedEvent,
} from "./types";

export class ZHAClusterCommands extends LitElement {
  public opp?: OpenPeerPower;
  public isWide?: boolean;
  public selectedNode?: ZHADevice;
  public selectedCluster?: Cluster;
  private _showHelp: boolean;
  private _commands: Command[];
  private _selectedCommandIndex: number;
  private _manufacturerCodeOverride?: number;
  private _issueClusterCommandServiceData?: IssueCommandServiceData;

  constructor() {
    super();
    this._showHelp = false;
    this._selectedCommandIndex = -1;
    this._commands = [];
  }

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
      isWide: {},
      selectedNode: {},
      selectedCluster: {},
      _showHelp: {},
      _commands: {},
      _selectedCommandIndex: {},
      _manufacturerCodeOverride: {},
      _issueClusterCommandServiceData: {},
    };
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("selectedCluster")) {
      this._commands = [];
      this._selectedCommandIndex = -1;
      this._fetchCommandsForCluster();
    }
    super.update(changedProperties);
  }

  protected render(): TemplateResult | void {
    return html`
      <op-config-section .isWide="${this.isWide}">
        <div class="sectionHeader" slot="header">
          <span>Cluster Commands</span>
          <paper-icon-button
            class="toggle-help-icon"
            @click="${this._onHelpTap}"
            icon="opp:help-circle"
          >
          </paper-icon-button>
        </div>
        <span slot="introduction">View and issue cluster commands.</span>

        <op-card class="content">
          <div class="command-picker">
            <paper-dropdown-menu
              label="Commands of the selected cluster"
              class="flex"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected="${this._selectedCommandIndex}"
                @iron-select="${this._selectedCommandChanged}"
              >
                ${this._commands.map(
                  (entry) => html`
                    <paper-item
                      >${entry.name +
                        " (id: " +
                        formatAsPaddedHex(entry.id) +
                        ")"}</paper-item
                    >
                  `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          ${this._showHelp
            ? html`
                <div class="help-text">Select a command to interact with</div>
              `
            : ""}
          ${this._selectedCommandIndex !== -1
            ? html`
                <div class="input-text">
                  <paper-input
                    label="Manufacturer code override"
                    type="number"
                    .value="${this._manufacturerCodeOverride}"
                    @value-changed="${this._onManufacturerCodeOverrideChanged}"
                    placeholder="Value"
                  ></paper-input>
                </div>
                <div class="card-actions">
                  <op-call-service-button
                    .opp="${this.opp}"
                    domain="zha"
                    service="issue_zigbee_cluster_command"
                    .serviceData="${this._issueClusterCommandServiceData}"
                    >Issue Zigbee Command</op-call-service-button
                  >
                  ${this._showHelp
                    ? html`
                        <op-service-description
                          .opp="${this.opp}"
                          domain="zha"
                          service="issue_zigbee_cluster_command"
                          class="help-text2"
                        ></op-service-description>
                      `
                    : ""}
                </div>
              `
            : ""}
        </op-card>
      </op-config-section>
    `;
  }

  private async _fetchCommandsForCluster(): Promise<void> {
    if (this.selectedNode && this.selectedCluster && this.opp) {
      this._commands = await fetchCommandsForCluster(
        this.opp,
        this.selectedNode!.ieee,
        this.selectedCluster!.endpoint_id,
        this.selectedCluster!.id,
        this.selectedCluster!.type
      );
      this._commands.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
  }

  private _computeIssueClusterCommandServiceData():
    | IssueCommandServiceData
    | undefined {
    if (!this.selectedNode || !this.selectedCluster) {
      return;
    }
    return {
      ieee: this.selectedNode!.ieee,
      endpoint_id: this.selectedCluster!.endpoint_id,
      cluster_id: this.selectedCluster!.id,
      cluster_type: this.selectedCluster!.type,
      command: this._commands[this._selectedCommandIndex].id,
      command_type: this._commands[this._selectedCommandIndex].type,
    };
  }

  private _onManufacturerCodeOverrideChanged(value: ChangeEvent): void {
    this._manufacturerCodeOverride = value.detail!.value;
    this._issueClusterCommandServiceData = this._computeIssueClusterCommandServiceData();
  }

  private _onHelpTap(): void {
    this._showHelp = !this._showHelp;
  }

  private _selectedCommandChanged(event: ItemSelectedEvent): void {
    this._selectedCommandIndex = event.target!.selected;
    this._issueClusterCommandServiceData = this._computeIssueClusterCommandServiceData();
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

        op-card {
          margin: 0 auto;
          max-width: 600px;
        }

        .card-actions.warning op-call-service-button {
          color: var(--google-red-500);
        }

        .command-picker {
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

        .input-text {
          padding-left: 28px;
          padding-right: 28px;
          padding-bottom: 10px;
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

        .help-text2 {
          color: grey;
          padding: 16px;
        }

        .toggle-help-icon {
          position: absolute;
          top: -6px;
          right: 0;
          color: var(--primary-color);
        }

        op-service-description {
          display: block;
          color: grey;
        }

        [hidden] {
          display: none;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zha-cluster-commands": ZHAClusterCommands;
  }
}

customElements.define("zha-cluster-commands", ZHAClusterCommands);
