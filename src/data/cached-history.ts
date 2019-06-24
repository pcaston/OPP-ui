import {
  computeHistory,
  fetchRecent,
  HistoryResult,
  TimelineEntity,
  LineChartUnit,
} from "./history";
import { OpenPeerPower } from "../types";
import { OppEntity } from "../open-peer-power-js-websocket/lib";

interface CacheConfig {
  refresh: number;
  cacheKey: string;
  hoursToShow: number;
}

interface CachedResults {
  prom: Promise<HistoryResult>;
  startTime: Date;
  endTime: Date;
  data: HistoryResult;
}

// This is a different interface, a different cache :(
interface RecentCacheResults {
  created: number;
  data: Promise<HistoryResult>;
}

const RECENT_THRESHOLD = 60000; // 1 minute
const RECENT_CACHE: { [cacheKey: string]: RecentCacheResults } = {};
const stateHistoryCache: { [cacheKey: string]: CachedResults } = {};

// Cached type 1 unction. Without cache config.
export const getRecent = (
  opp: OpenPeerPower,
  entityId: string,
  startTime: Date,
  endTime: Date,
) => {
  const cacheKey = entityId;
  const cache = RECENT_CACHE[cacheKey];

  if (
    cache &&
    Date.now() - cache.created < RECENT_THRESHOLD 
  ) {
    return cache.data;
  }

  const prom = fetchRecent(opp, entityId, startTime, endTime).then(
    (stateHistory) => computeHistory(opp, stateHistory, localize),
    (err) => {
      delete RECENT_CACHE[entityId];
      throw err;
    }
  );

  RECENT_CACHE[cacheKey] = {
    created: Date.now(),
    data: prom,
  };
  return prom;
};

// Cache type 2 functionality
function getEmptyCache(
  startTime: Date,
  endTime: Date
): CachedResults {
  return {
    prom: Promise.resolve({ line: [], timeline: [] }),
    startTime,
    endTime,
    data: { line: [], timeline: [] },
  };
}

export const getRecentWithCache = (
  opp: OpenPeerPower,
  entityId: string,
  cacheConfig: CacheConfig,
) => {
  const cacheKey = cacheConfig.cacheKey;
  const endTime = new Date();
  const startTime = new Date(endTime);
  startTime.setHours(startTime.getHours() - cacheConfig.hoursToShow);
  let toFetchStartTime = startTime;
  let appendingToCache = false;

  let cache = stateHistoryCache[cacheKey];
  if (
    cache &&
    toFetchStartTime >= cache.startTime &&
    toFetchStartTime <= cache.endTime
  ) {
    toFetchStartTime = cache.endTime;
    appendingToCache = true;
    // This pretty much never happens as endTime is usually set to now
    if (endTime <= cache.endTime) {
      return cache.prom;
    }
  } else {
    cache = stateHistoryCache[cacheKey] = getEmptyCache(
      startTime,
      endTime
    );
  }

  const curCacheProm = cache.prom;

  const genProm = async () => {
    let fetchedHistory: OppEntity[][];

    try {
      const results = await Promise.all([
        curCacheProm,
        fetchRecent(
          opp,
          entityId,
          toFetchStartTime,
          endTime,
          appendingToCache
        ),
      ]);
      fetchedHistory = results[1];
    } catch (err) {
      delete stateHistoryCache[cacheKey];
      throw err;
    }
    const stateHistory = computeHistory(
      opp,
      fetchedHistory,
    );
    if (appendingToCache) {
      mergeLine(stateHistory.line, cache.data.line);
      mergeTimeline(stateHistory.timeline, cache.data.timeline);
      pruneStartTime(startTime, cache.data);
    } else {
      cache.data = stateHistory;
    }
    return cache.data;
  };

  cache.prom = genProm();
  cache.startTime = startTime;
  cache.endTime = endTime;
  return cache.prom;
};

const mergeLine = (
  historyLines: LineChartUnit[],
  cacheLines: LineChartUnit[]
) => {
  historyLines.forEach((line) => {
    const unit = line.unit;
    const oldLine = cacheLines.find((cacheLine) => cacheLine.unit === unit);
    if (oldLine) {
      line.data.forEach((entity) => {
        const oldEntity = oldLine.data.find(
          (cacheEntity) => entity.entity_id === cacheEntity.entity_id
        );
        if (oldEntity) {
          oldEntity.states = oldEntity.states.concat(entity.states);
        } else {
          oldLine.data.push(entity);
        }
      });
    } else {
      cacheLines.push(line);
    }
  });
};

const mergeTimeline = (
  historyTimelines: TimelineEntity[],
  cacheTimelines: TimelineEntity[]
) => {
  historyTimelines.forEach((timeline) => {
    const oldTimeline = cacheTimelines.find(
      (cacheTimeline) => cacheTimeline.entity_id === timeline.entity_id
    );
    if (oldTimeline) {
      oldTimeline.data = oldTimeline.data.concat(timeline.data);
    } else {
      cacheTimelines.push(timeline);
    }
  });
};

const pruneArray = (originalStartTime: Date, arr) => {
  if (arr.length === 0) {
    return arr;
  }
  const changedAfterStartTime = arr.findIndex(
    (state) => new Date(state.last_changed) > originalStartTime
  );
  if (changedAfterStartTime === 0) {
    // If all changes happened after originalStartTime then we are done.
    return arr;
  }

  // If all changes happened at or before originalStartTime. Use last index.
  const updateIndex =
    changedAfterStartTime === -1 ? arr.length - 1 : changedAfterStartTime - 1;
  arr[updateIndex].last_changed = originalStartTime;
  return arr.slice(updateIndex);
};

const pruneStartTime = (originalStartTime: Date, cacheData: HistoryResult) => {
  cacheData.line.forEach((line) => {
    line.data.forEach((entity) => {
      entity.states = pruneArray(originalStartTime, entity.states);
    });
  });

  cacheData.timeline.forEach((timeline) => {
    timeline.data = pruneArray(originalStartTime, timeline.data);
  });
};
