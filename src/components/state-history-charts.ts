import "@polymer/paper-spinner/paper-spinner";
import {
  LitElement,
  html,
  TemplateResult,
  property,
  customElement
} from "lit-element";

import "./state-history-chart-line";
import "./state-history-chart-timeline";
import { OpenPeerPower } from '../types';

@customElement('state-history-charts')
export class StateHistoryCharts extends LitElement {
  @property({type : Object}) public opp?: OpenPeerPower;
  @property({type : Object}) public historyData = null;
  @property({type : Object}) public names = {};
  @property({type : Boolean}) public isLoadingData = false;
  @property({type : Object}) public endTime = {};
  @property({type : Boolean}) public upToNow = false;
  @property({type : Boolean}) public noSingle = false;

  protected render(): TemplateResult | void {
    console.log('state history charts');
    return html`
      <style>
        :host {
          display: block;
          /* height of single timeline chart = 58px */
          min-height: 58px;
        }
        .info {
          text-align: center;
          line-height: 58px;
          color: var(--secondary-text-color);
        }
      </style>
      $${this._computeIsLoading(this.isLoadingData)?
        html`
          <div class="info">
            history
          </div>
        ` : ``
      }

      $${this._computeIsLoading(this.isLoadingData)?
        html`
        <div class="info">
          no history found
        </div>
        ` : ``
      }
      $${this.historyData!.timeline.length?
        html`
        <state-history-chart-timeline
            .opp="${this.opp}"
            data="${this.historyData!.timeline}"
            end-time="${this._computeEndTime(this.endTime, this.upToNow, this.historyData)}"
            no-single="${this.noSingle}"
            names="${this.names}"
        ></state-history-chart-timeline>
      ` : ``
      }

      ${Object.keys(this.historyData!.line).map((key, item) => {
        return html`
          <div>
            <state-history-chart-line
              .opp="${this.opp}"
              unit="${item.unit}"
              data="${item.data}"
              identifier="${item.identifier}"
              is-single-device="${this._computeIsSingleLineChart(item.data, this.noSingle)}"
              end-time="${this._computeEndTime(this.endTime, this.upToNow, this.historyData)}"
              names="${this.names}"
            ></state-history-chart-line>
          </div>
        `;
      })
      };
    `;
  }

  _computeIsSingleLineChart(data, noSingle) {
    return !noSingle && data && data.length === 1;
  }

  _computeIsEmpty(isLoadingData, historyData) {
    const historyDataEmpty =
      !historyData ||
      !historyData.timeline ||
      !historyData.line ||
      (historyData.timeline.length === 0 && historyData.line.length === 0);
    return !isLoadingData && historyDataEmpty;
  }

  _computeIsLoading(isLoading) {
    return isLoading && !this.historyData;
  }

  _computeEndTime(endTime, upToNow) {
    // We don't really care about the value of historyData, but if it change we want to update
    // endTime.
    return upToNow ? new Date() : endTime;
  }
}