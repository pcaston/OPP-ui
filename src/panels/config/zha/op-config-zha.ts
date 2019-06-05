import "../../../components/op-paper-icon-button-arrow-prev";
import "../../../layouts/opp-subpage";
import "./open-peer-powerbinding";
import "./open-peer-powercluster-attributes";
import "./open-peer-powercluster-commands";
import "./open-peer-powernetwork";
import "./open-peer-powernode";
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

export class HaConfigZha extends LitElement {
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
        <open-peer-powernetwork
          .isWide="${this.isWide}"
          .opp="${this.opp}"
        ></open-peer-powernetwork>

        <open-peer-powernode
          .isWide="${this.isWide}"
          .opp="${this.opp}"
          @open-peer-powercluster-selected="${this._onClusterSelected}"
          @open-peer-powernode-selected="${this._onDeviceSelected}"
        ></open-peer-powernode>
        ${this._selectedCluster
          ? html`
              <open-peer-powercluster-attributes
                .isWide="${this.isWide}"
                .opp="${this.opp}"
                .selectedNode="${this._selectedDevice}"
                .selectedCluster="${this._selectedCluster}"
              ></open-peer-powercluster-attributes>

              <open-peer-powercluster-commands
                .isWide="${this.isWide}"
                .opp="${this.opp}"
                .selectedNode="${this._selectedDevice}"
                .selectedCluster="${this._selectedCluster}"
              ></open-peer-powercluster-commands>
            `
          : ""}
        ${this._selectedDevice && this._bindableDevices.length > 0
          ? html`
              <open-peer-powerbinding-control
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
    "op-config-zha": HaConfigZha;
  }
}

customElements.define("op-config-zha", HaConfigZha);
