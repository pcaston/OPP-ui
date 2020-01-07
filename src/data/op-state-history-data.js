import { timeOut } from "@polymer/polymer/lib/utils/async";
import { Debouncer } from "@polymer/polymer/lib/utils/debounce";
import { PolymerElement } from "@polymer/polymer/polymer-element";


import { computeHistory, fetchDate } from "./history";
import { getRecent, getRecentWithCache } from "./cached-history";

/*
 */
class OpStateHistoryData extends PolymerElement {
  static get properties() {
    return {
      opp: {
        type: Object,
        observer: "oppChanged",
      },

      filterType: String,

      cacheConfig: Object,

      startTime: Date,
      endTime: Date,

      entityId: String,

      isLoading: {
        type: Boolean,
        value: true,
        readOnly: true,
        notify: true,
      },

      data: {
        type: Object,
        value: null,
        readOnly: true,
        notify: true,
      },
    };
  }

  static get observers() {
    return [
      "filterChangedDebouncer(filterType, entityId, startTime, endTime, cacheConfig)",
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.filterChangedDebouncer(
      this.filterType,
      this.entityId,
      this.startTime,
      this.endTime,
      this.cacheConfig
    );
  }

  disconnectedCallback() {
    if (this._refreshTimeoutId) {
      window.clearInterval(this._refreshTimeoutId);
      this._refreshTimeoutId = null;
    }
    super.disconnectedCallback();
  }

  oppChanged(newOpp, oldOpp) {
    if (!oldOpp && !this._madeFirstCall) {
      this.filterChangedDebouncer(
        this.filterType,
        this.entityId,
        this.startTime,
        this.endTime,
        this.cacheConfig
      );
    }
  }

  filterChangedDebouncer(...args) {
    this._debounceFilterChanged = Debouncer.debounce(
      this._debounceFilterChanged,
      timeOut.after(0),
      () => {
        this.filterChanged(...args);
      }
    );
  }

  filterChanged(
    filterType,
    entityId,
    startTime,
    endTime,
    cacheConfig,
  ) {
    if (!this.opp) {
      return;
    }
    if (cacheConfig && !cacheConfig.cacheKey) {
      return;
    }
    this._madeFirstCall = true;
    let data;

    if (filterType === "date") {
      if (!startTime || !endTime) return;

      data = fetchDate(this.opp, startTime, endTime).then((dateHistory) =>
        computeHistory(this.opp, dateHistory)
      );
    } else if (filterType === "recent-entity") {
      if (!entityId) return;
      if (cacheConfig) {
        data = this.getRecentWithCacheRefresh(
          entityId,
          cacheConfig
        );
      } else {
        data = getRecent(
          this.opp,
          entityId,
          startTime,
          endTime
        );
      }
    } else {
      return;
    }
    this._setIsLoading(true);

    data.then((stateHistory) => {
      this._setData(stateHistory);
      this._setIsLoading(false);
    });
  }

  getRecentWithCacheRefresh(entityId, cacheConfig) {
    if (this._refreshTimeoutId) {
      window.clearInterval(this._refreshTimeoutId);
      this._refreshTimeoutId = null;
    }
    if (cacheConfig.refresh) {
      this._refreshTimeoutId = window.setInterval(() => {
        getRecentWithCache(
          this.opp,
          entityId,
          cacheConfig
        ).then((stateHistory) => {
          this._setData(Object.assign({}, stateHistory));
        });
      }, cacheConfig.refresh * 1000);
    }
    return getRecentWithCache(
      this.opp,
      entityId,
      cacheConfig
    );
  }
}
customElements.define("op-state-history-data", OpStateHistoryData);
