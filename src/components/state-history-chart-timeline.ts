import "@polymer/polymer/lib/utils/debounce";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";


import "./entity/op-chart-base";

import formatDateTime from "../common/datetime/format_date_time";

class StateHistoryChartTimeline extends PolymerElement {
  static get template() {
    console.log('state history chart line');
    return html`
      <style>
        :host {
          display: block;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        :host([rendered]) {
          opacity: 1;
        }

        op-chart-base {
          direction: ltr;
        }
      </style>
      <op-chart-base
        data="[[chartData]]"
        rendered="{{rendered}}"
        rtl=false
      ></op-chart-base>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
      },
      chartData: Object,
      data: {
        type: Object,
        observer: "dataChanged",
      },
      names: Object,
      noSingle: Boolean,
      endTime: Date,
      rendered: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return ["dataChanged(data, endTime)"];
  }

  connectedCallback() {
    super.connectedCallback();
    this._isAttached = true;
    this.drawChart();
  }

  dataChanged() {
    this.drawChart();
  }

  drawChart() {
    const staticColors = {
      on: 1,
      off: 0,
      unavailable: "#a0a0a0",
      unknown: "#606060",
      idle: 2,
    };
    let stateHistory = this.data;

    if (!this._isAttached) {
      return;
    }

    if (!stateHistory) {
      stateHistory = [];
    }

    const startTime = new Date(
      stateHistory.reduce(
        (minTime, stateInfo) =>
          Math.min(minTime, new Date(stateInfo.data[0].last_changed)),
        new Date()
      )
    );

    // end time is Math.max(startTime, last_event)
    let endTime =
      this.endTime ||
      new Date(
        stateHistory.reduce(
          (maxTime, stateInfo) =>
            Math.max(
              maxTime,
              new Date(stateInfo.data[stateInfo.data.length - 1].last_changed)
            ),
          startTime
        )
      );

    if (endTime > new Date()) {
      endTime = new Date();
    }

    const labels = [];
    const datasets = [];
    // stateHistory is a list of lists of sorted state objects
    const names = this.names || {};
    stateHistory.forEach((stateInfo) => {
      let newLastChanged;
      let prevState = null;
      let locState = null;
      let prevLastChanged = startTime;
      const entityDisplay = names[stateInfo.entity_id] || stateInfo.name;

      const dataRow = [];
      stateInfo.data.forEach((state) => {
        let newState = state.state;
        const timeStamp = new Date(state.last_changed);
        if (newState === undefined || newState === "") {
          newState = null;
        }
        if (timeStamp > endTime) {
          // Drop datapoints that are after the requested endTime. This could happen if
          // endTime is 'now' and client time is not in sync with server time.
          return;
        }
        if (prevState !== null && newState !== prevState) {
          newLastChanged = new Date(state.last_changed);

          dataRow.push([prevLastChanged, newLastChanged, locState, prevState]);

          prevState = newState;
          prevLastChanged = newLastChanged;
        } else if (prevState === null) {
          prevState = newState;
          prevLastChanged = new Date(state.last_changed);
        }
      });

      if (prevState !== null) {
        dataRow.push([prevLastChanged, endTime, locState, prevState]);
      }
      datasets.push({ data: dataRow });
      labels.push(entityDisplay);
    });

    const formatTooltipLabel = (item, data) => {
      const values = data.datasets[item.datasetIndex].data[item.index];

      const start = formatDateTime(values[0], this.opp.language);
      const end = formatDateTime(values[1], this.opp.language);
      const state = values[2];

      return [state, start, end];
    };

    const chartOptions = {
      type: "timeline",
      options: {
        tooltips: {
          callbacks: {
            label: formatTooltipLabel,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                major: {
                  fontStyle: "bold",
                },
              },
            },
          ],
          yAxes: [
            {
              afterSetDimensions: (yaxe) => {
                yaxe.maxWidth = yaxe.chart.width * 0.18;
              },
              position: "left",
            },
          ],
        },
      },
      data: {
        labels: labels,
        datasets: datasets,
      },
      colors: {
        staticColors: staticColors,
        staticColorIndex: 3,
      },
    };
    this.chartData = chartOptions;
  }

}
customElements.define(
  "state-history-chart-timeline",
  StateHistoryChartTimeline
);
