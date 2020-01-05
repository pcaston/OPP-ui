import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/state-history-charts";
import "../../../data/op-state-history-data";

import { processConfigEntities } from "../common/process-config-entities";

class HuiHistoryGraphCard extends PolymerElement {
  static get template() {
    return html`
      <style>
        .content {
          padding: 16px;
        }
        [header] .content {
          padding-top: 0;
        }
      </style>

      <op-card header$="[[_config.title]]">
        <div class="content">
          <op-state-history-data
            opp="[[opp]]"
            filter-type="recent-entity"
            entity-id="[[_entities]]"
            data="{{_stateHistory}}"
            is-loading="{{_stateHistoryLoading}}"
            cache-config="[[_cacheConfig]]"
          ></op-state-history-data>
          <state-history-charts
            opp="[[opp]]"
            history-data="[[_stateHistory]]"
            is-loading-data="[[_stateHistoryLoading]]"
            names="[[_names]]"
            up-to-now
            no-single
          ></state-history-charts>
        </div>
      </op-card>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      _config: Object,
      _names: Object,
      _entities: Array,

      _stateHistory: Object,
      _stateHistoryLoading: Boolean,
      _cacheConfig: Object,
    };
  }

  getCardSize() {
    return 4;
  }

  setConfig(config) {
    const entities = processConfigEntities(config.entities);

    this._config = config;

    const _entities = [];
    const _names = {};
    for (const entity of entities) {
      _entities.push(entity.entity);
      if (entity.name) {
        _names[entity.entity] = entity.name;
      }
    }

    this.setProperties({
      _cacheConfig: {
        cacheKey: _entities.sort().join(),
        hoursToShow: config.hours_to_show || 24,
        refresh: config.refresh_interval || 0,
      },
      _entities,
      _names,
    });
  }
}

customElements.define("hui-history-graph-card", HuiHistoryGraphCard);
