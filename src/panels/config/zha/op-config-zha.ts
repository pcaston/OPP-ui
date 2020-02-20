import "../../../components/op-paper-icon-button-arrow-prev";
import "../../../layouts/opp-subpage";
import "./zop-binding";
import "./zop-cluster-attributes";
import "./zop-cluster-commands";
import "./zop-network";
import "./zop-node";
import "@polymer/paper-icon-button/paper-icon-button";

import {
  CSSResult,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from "lit-element";

import { OPPDomEvent } from "../../../common/dom/fire_event";
import { Cluster, fetchBindableDevices, ZHADevice } from "../../../data/zha";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import { sortZHADevices } from "./functions";
import { ZHAClusterSelectedParams, ZHADeviceSelectedParams } from "./types";

export class OpConfigZha extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public isWide?: boolean;
  @property() private _selectedDevice?: ZHADevice;
  @property() private _selectedCluster?: Cluster;
  @property() private _bindableDevices: ZHADevice[] = [];

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("_selectedDevice")) {
      this._fetchBindableDevices();
    }
    super.update(changedProperties);
  }

  protected render(): TemplateResult | void {
    return html`
      <opp-subpage header="Zigbee Home Automation">
        <zop-network
          .isWide="${this.isWide}"
          .opp="${this.opp}"
        ></zop-network>

        <zop-node
          .isWide="${this.isWide}"
          .opp="${this.opp}"
          @zop-cluster-selected="${this._onClusterSelected}"
          @zop-node-selected="${this._onDeviceSelected}"
        ></zop-node>
        ${this._selectedCluster
          ? html`
              <zop-cluster-attributes
                .isWide="${this.isWide}"
                .opp="${this.opp}"
                .selectedNode="${this._selectedDevice}"
                .selectedCluster="${this._selectedCluster}"
              ></zop-cluster-attributes>

              <zop-cluster-commands
                .isWide="${this.isWide}"
                .opp="${this.opp}"
                .selectedNode="${this._selectedDevice}"
                .selectedCluster="${this._selectedCluster}"
              ></zop-cluster-commands>
            `
          : ""}
        ${this._selectedDevice && this._bindableDevices.length > 0
          ? html`
              <zop-binding-control
                .isWide="${this.isWide}"
                .opp="${this.opp}"
                .selectedDevice="${this._selectedDevice}"
                .bindableDevices="${this._bindableDevices}"
              ></zop-binding-control>
            `
          : ""}
      </opp-subpage>
    `;
  }

  private _onClusterSelected(
    selectedClusterEvent: OPPDomEvent<ZHAClusterSelectedParams>
  ): void {
    this._selectedCluster = selectedClusterEvent.detail.cluster;
  }

  private _onDeviceSelected(
    selectedNodeEvent: OPPDomEvent<ZHADeviceSelectedParams>
  ): void {
    this._selectedDevice = selectedNodeEvent.detail.node;
    this._selectedCluster = undefined;
  }

  private async _fetchBindableDevices(): Promise<void> {
    if (this._selectedDevice && this.opp) {
      this._bindableDevices = (await fetchBindableDevices(
        this.opp,
        this._selectedDevice!.ieee
      )).sort(sortZHADevices);
    }
  }

  static get styles(): CSSResult[] {
    return [opStyle];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-config-zha": OpConfigZha;
  }
}

customElements.define("op-config-zha", OpConfigZha);
