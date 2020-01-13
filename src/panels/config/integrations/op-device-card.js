import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../layouts/opp-subpage";

import { EventsMixin } from "../../../mixins/events-mixin";
import LocalizeMixin from "../../../mixins/localize-mixin";
import { computeStateName } from "../../../common/entity/compute_state_name";
import "../../../components/entity/state-badge";
import { compare } from "../../../common/string/compare";
import {
  subscribeDeviceRegistry,
  updateDeviceRegistryEntry,
} from "../../../data/device_registry";
import { subscribeAreaRegistry } from "../../../data/area_registry";

import {
  showDeviceRegistryDetailDialog,
  loadDeviceRegistryDetailDialog,
} from "./show-dialog-device-registry-detail";

function computeEntityName(opp, entity) {
  if (entity.name) return entity.name;
  const state = opp.states[entity.entity_id];
  return state ? computeStateName(state) : null;
}

/*
 * @appliesMixin EventsMixin
 */
class OpDeviceCard extends EventsMixin(LocalizeMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host(:not([narrow])) .device-entities {
          max-height: 225px;
          overflow: auto;
        }
        op-card {
          flex: 1 0 100%;
          padding-bottom: 10px;
          min-width: 0;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
        }
        .card-header .name {
          width: 90%;
        }
        .device {
          width: 30%;
        }
        .device .name {
          font-weight: bold;
        }
        .device .model,
        .device .manuf,
        .device .area {
          color: var(--secondary-text-color);
        }
        .area .extra-info .name {
          color: var(--primary-text-color);
        }
        .extra-info {
          margin-top: 8px;
        }
        paper-icon-item {
          cursor: pointer;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        .manuf,
        .entity-id,
        .area {
          color: var(--secondary-text-color);
        }
      </style>
      <op-card>
        <div class="card-header">
          <div class="name">[[_deviceName(device)]]</div>
          <paper-icon-button
            icon="opp:settings"
            on-click="_gotoSettings"
          ></paper-icon-button>
        </div>
        <div class="card-content">
          <div class="info">
            <div class="model">[[device.model]]</div>
            <div class="manuf">
              [[localize('ui.panel.config.integrations.config_entry.manuf',
              'manufacturer', device.manufacturer)]]
            </div>
            <template is="dom-if" if="[[device.area_id]]">
              <div class="area">
                <div class="extra-info">
                  [[localize('ui.panel.config.integrations.device_registry.area')]]
                  <span class="name">{{_computeArea(areas, device)}}</span>
                </div>
              </div>
            </template>
          </div>
          <template is="dom-if" if="[[device.via_device_id]]">
            <div class="extra-info">
              [[localize('ui.panel.config.integrations.config_entry.via')]]
              <span class="hub"
                >[[_computeDeviceName(devices, device.via_device_id)]]</span
              >
            </div>
          </template>
          <template is="dom-if" if="[[device.sw_version]]">
            <div class="extra-info">
              [[localize('ui.panel.config.integrations.config_entry.firmware',
              'version', device.sw_version)]]
            </div>
          </template>
        </div>

        <div class="device-entities">
          <template
            is="dom-repeat"
            items="[[_computeDeviceEntities(opp, device, entities)]]"
            as="entity"
          >
            <paper-icon-item on-click="_openMoreInfo">
              <state-badge
                state-obj="[[_computeStateObj(entity, opp)]]"
                slot="item-icon"
              ></state-badge>
              <paper-item-body>
                <div class="name">[[_computeEntityName(entity, opp)]]</div>
                <div class="secondary entity-id">[[entity.entity_id]]</div>
              </paper-item-body>
            </paper-icon-item>
          </template>
        </div>
      </op-card>
    `;
  }

  static get properties() {
    return {
      device: Object,
      devices: Array,
      areas: Array,
      entities: Array,
      opp: Object,
      narrow: {
        type: Boolean,
        reflectToAttribute: true,
      },
      _childDevices: {
        type: Array,
        computed: "_computeChildDevices(device, devices)",
      },
    };
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    loadDeviceRegistryDetailDialog();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubAreas = subscribeAreaRegistry(this.opp.connection, (areas) => {
      this._areas = areas;
    });
    this._unsubDevices = subscribeDeviceRegistry(
      this.opp.connection,
      (devices) => {
        this.devices = devices;
        this.device = devices.find((device) => device.id === this.device.id);
      }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubAreas) {
      this._unsubAreas();
    }
    if (this._unsubDevices) {
      this._unsubDevices();
    }
  }

  _computeArea(areas, device) {
    if (!areas || !device || !device.area_id) {
      return "No Area";
    }
    // +1 because of "No Area" entry
    return areas.find((area) => area.area_id === device.area_id).name;
  }

  _computeChildDevices(device, devices) {
    return devices
      .filter((dev) => dev.via_device_id === device.id)
      .sort((dev1, dev2) => compare(dev1.name, dev2.name));
  }

  _computeDeviceEntities(opp, device, entities) {
    return entities
      .filter((entity) => entity.device_id === device.id)
      .sort((ent1, ent2) =>
        compare(
          computeEntityName(opp, ent1) || `zzz${ent1.entity_id}`,
          computeEntityName(opp, ent2) || `zzz${ent2.entity_id}`
        )
      );
  }

  _computeStateObj(entity, opp) {
    return opp.states[entity.entity_id];
  }

  _computeEntityName(entity, opp) {
    return (
      computeEntityName(opp, entity) ||
      `(${this.localize(
        "ui.panel.config.integrations.config_entry.entity_unavailable"
      )})`
    );
  }

  _deviceName(device) {
    return device.name_by_user || device.name;
  }

  _computeDeviceName(devices, deviceId) {
    const device = devices.find((dev) => dev.id === deviceId);
    return device
      ? this._deviceName(device)
      : `(${this.localize(
          "ui.panel.config.integrations.config_entry.device_unavailable"
        )})`;
  }

  _gotoSettings() {
    const device = this.device;
    showDeviceRegistryDetailDialog(this, {
      device,
      updateEntry: async (updates) => {
        await updateDeviceRegistryEntry(this.opp, device.id, updates);
      },
    });
  }

  _openMoreInfo(ev) {
    this.fire("opp-more-info", { entityId: ev.model.entity.entity_id });
  }
}

customElements.define("op-device-card", OpDeviceCard);
