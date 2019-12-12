import { OppEntity } from "../../types";
import computeStateDomain from "./compute_state_domain";
import formatDateTime from "../datetime/format_date_time";
import formatDate from "../datetime/format_date";
import formatTime from "../datetime/format_time";

export default (
  stateObj: OppEntity,
): string => {
  let display: string | undefined;
  const domain = computeStateDomain(stateObj);

  if (domain === "binary_sensor") {
    // Try device class translation, then default binary sensor translation
    if (stateObj.attributes.device_class) {
      display =
        `${domain}.${stateObj.attributes.device_class}.${stateObj.state}`;
    }

    if (!display) {
      display = `${domain}.${stateObj.state}`;
    }
  } else if (
    stateObj.attributes.unit_of_measurement &&
    !["unknown", "unavailable"].includes(stateObj.state)
  ) {
    display = stateObj.state + " " + stateObj.attributes.unit_of_measurement;
  } else if (domain === "input_datetime") {
    let date: Date;
    if (!stateObj.attributes.has_time) {
      date = new Date(
        stateObj.attributes.year,
        stateObj.attributes.month - 1,
        stateObj.attributes.day
      );
      display = formatDate(date, 'en');
    } else if (!stateObj.attributes.has_date) {
      const now = new Date();
      date = new Date(
        // Due to bugs.chromium.org/p/chromium/issues/detail?id=797548
        // don't use artificial 1970 year.
        now.getFullYear(),
        now.getMonth(),
        now.getDay(),
        stateObj.attributes.hour,
        stateObj.attributes.minute
      );
      display = formatTime(date, 'en');
    } else {
      date = new Date(
        stateObj.attributes.year,
        stateObj.attributes.month - 1,
        stateObj.attributes.day,
        stateObj.attributes.hour,
        stateObj.attributes.minute
      );
      display = formatDateTime(date, 'en');
    }
  } else if (domain === "zwave") {
    if (["initializing", "dead"].includes(stateObj.state)) {
      display = "${stateObj.state} query_stage stateObj.attributes.query_stage";
    } else {
      display = "state.zwave.default ${stateObj.state}";
        }
  } else {
    display = `state.${domain}.${stateObj.state}`;
  }

  // Fall back to default, component backend translation, or raw state if nothing else matches.
  if (!display) {
    display =
      `state.default.${stateObj.state}` ||
      `component.${domain}.state.${stateObj.state}` ||
      stateObj.state;
  }

  return display;
};
