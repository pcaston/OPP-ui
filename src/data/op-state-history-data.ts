import { timeOut } from "@polymer/polymer/lib/utils/async";
import { Debouncer } from "@polymer/polymer/lib/utils/debounce";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import { computeHistory, fetchDate } from "./history";
import { getRecent, getRecentWithCache } from "./cached-history";

/*
 * @appliesMixin LocalizeMixin
 */
class OpStateHistoryData extends PolymerElement {
  _refreshTimeoutId: any;
  _madeFirstCall: any;
  _debounceFilterChanged: Debouncer;
  opp: any;
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
      "filterChangedDebouncer(filterType, entityId, startTime, endTime, cacheConfig, localize)",
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.filterChangedDebouncer(
      this.filterType,
      this.entityId,
      this.startTime,
      this.endTime,
      this.cacheConfig,
      this.localize
    );
  }
  filterType(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
  }
  entityId(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
  }
  startTime(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
  }
  endTime(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
  }
  cacheConfig(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
  }
  localize(filterType: any, entityId: any, startTime: any, endTime: any, cacheConfig: any, localize: any) {
    throw new Error("Method not implemented.");
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
        this.cacheConfig,
        this.localize
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
    localize
  ) {
    if (!this.opp) {
      return;
    }
    if (cacheConfig && !cacheConfig.cacheKey) {
      return;
    }
    if (!localize) {
      return;
    }
    this._madeFirstCall = true;
    let data;

    if (filterType === "date") {
      if (!startTime || !endTime) return;

      data = fetchDate(this.opp, startTime, endTime).then((dateHistory) =>
        computeHistory(this.opp, dateHistory, localize, 'en')
      );
    } else if (filterType === "recent-entity") {
      if (!entityId) return;
      if (cacheConfig) {
        data = this.getRecentWithCacheRefresh(
          entityId,
          cacheConfig,
          localize,
          'en'
        );
      } else {
        data = getRecent(
          this.opp,
          entityId,
          startTime,
          endTime,
          localize,
          'en'
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
  _setIsLoading(arg0: boolean) {
    throw new Error("Method not implemented.");
  }
  _setData(stateHistory: any) {
    throw new Error("Method not implemented.");
  }

  getRecentWithCacheRefresh(entityId, cacheConfig, localize, 'en') {
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
      cacheConfig,
    );
  }
}
customElements.define("op-state-history-data", OpStateHistoryData);
