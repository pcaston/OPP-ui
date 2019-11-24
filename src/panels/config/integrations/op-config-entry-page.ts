import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../layouts/opp-subpage";

import "../../../components/entity/state-badge";
import { compare } from "../../../common/string/compare";

import "./op-device-card";
import "./op-ce-entities-card";
import { EventsMixin } from "../../../mixins/events-mixin";
import NavigateMixin from "../../../mixins/navigate-mixin";

class HaConfigEntryPage extends NavigateMixin(
  EventsMixin(PolymerElement)
) {
  static get template() {
    return html`
      <style>
        .content {
          display: flex;
          flex-wrap: wrap;
          padding: 4px;
          justify-content: center;
        }
        .card {
          box-sizing: border-box;
          display: flex;
          flex: 1 0 300px;
          min-width: 0;
          max-width: 500px;
          padding: 8px;
        }
      </style>
      <opp-subpage header="[[configEntry.title]]">
        <paper-icon-button
          slot="toolbar-icon"
          icon="opp:delete"
          on-click="_removeEntry"
        ></paper-icon-button>
        <div class="content">
          <template
            is="dom-if"
            if="[[_computeIsEmpty(_configEntryDevices, _noDeviceEntities)]]"
          >
            <p>
              [['ui.panel.config.integrations.config_entry.no_devices']]
            </p>
          </template>
          <template is="dom-repeat" items="[[_configEntryDevices]]" as="device">
            <op-device-card
              class="card"
              opp="[[opp]]"
              areas="[[areas]]"
              devices="[[devices]]"
              device="[[device]]"
              entities="[[entities]]"
              narrow="[[narrow]]"
            ></op-device-card>
          </template>
          <template is="dom-if" if="[[_noDeviceEntities.length]]">
            <op-ce-entities-card
              class="card"
              heading="[['ui.panel.config.integrations.config_entry.no_device']]"
              entities="[[_noDeviceEntities]]"
              opp="[[opp]]"
              narrow="[[narrow]]"
            ></op-ce-entities-card>
          </template>
        </div>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
      narrow: Boolean,
      configEntry: {
        type: Object,
        value: null,
      },

      _configEntryDevices: {
        type: Array,
        computed: "_computeConfigEntryDevices(configEntry, devices)",
      },

      /**
       * All entity registry entries for this config entry that do not belong
       * to a device.
       */
      _noDeviceEntities: {
        type: Array,
        computed: "_computeNoDeviceEntities(configEntry, entities)",
      },

      /**
       * Area registry entries
       */
      areas: Array,

      /**
       * Device registry entries
       */
      devices: Array,

      /**
       * Existing entries.
       */
      entries: Array,

      /**
       * Entity Registry entries.
       */
      entities: Array,
    };
  }

  _computeConfigEntryDevices(configEntry, devices) {
    if (!devices) return [];
    return devices
      .filter((device) => device.config_entries.includes(configEntry.entry_id))
      .sort(
        (dev1, dev2) =>
          !!dev1.hub_device_id - !!dev2.hub_device_id ||
          compare(dev1.name, dev2.name)
      );
  }

  _computeNoDeviceEntities(configEntry, entities) {
    if (!entities) return [];
    return entities.filter(
      (ent) => !ent.device_id && ent.config_entry_id === configEntry.entry_id
    );
  }

  _computeIsEmpty(configEntryDevices, noDeviceEntities) {
    return configEntryDevices.length === 0 && noDeviceEntities.length === 0;
  }

  _removeEntry() {
    if (
      !confirm(
        "ui.panel.config.integrations.config_entry.delete_confirm"
      )
    )
      return;

    const entryId = this.configEntry.entry_id;

    this.opp
      .callApi("delete", `config/config_entries/entry/${entryId}`)
      .then((result) => {
        this.fire("opp-reload-entries");
        if (result.require_restart) {
          alert(
            "ui.panel.config.integrations.config_entry.restart_confirm"
          );
        }
        this.navigate("/config/integrations/dashboard", true);
      });
  }
}

customElements.define("op-config-entry-page", HaConfigEntryPage);
