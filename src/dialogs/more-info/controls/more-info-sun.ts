import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { OpenPeerPower, OppEntities} from "../../../types";
import {
  LitElement,
  css,
  html,
  property,
  customElement,
  TemplateResult,
} from "lit-element";

import "../../../components/op-relative-time";

import formatTime from "../../../common/datetime/format_time";

@customElement("more-info-sun")
export class MoreInfoSun extends LitElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) stateObj!: OppEntities;
  @property({ type : Object }) risingDate = this.computeRising(this.stateObj);
  @property({ type : Object }) settingDate = this.computeSetting(this.stateObj);
  static get styles() {
    return [
      css`
      <style include="iron-flex iron-flex-alignment"></style>
      `
    ];
  }

  protected render(): TemplateResult | void  {
    return html`
      ${Object.keys(this.computeOrder(risingDate, settingDate)).map((key) => {
        const item: String = items[key];
        return html`
          <div class="data-entry layout justified horizontal">
            <div class="key">
              <span>${this..itemCaption(item)}</span>
                <op-relative-time
                  opp="${this.opp}"
                  datetime-obj="${this.itemDate(item)}"
                ></op-relative-time>
              </div>
            <div class="value">${this.itemValue(item)}</div>
          </div>
        `;
      })
      <div class="data-entry layout justified horizontal">
        <div class="key">elevation</div>
        <div class="value">elevation</div>
      </div>
    `;
  }

  computeRising(stateObj) {
    return new Date(stateObj.attributes.next_rising);
  }

  computeSetting(stateObj) {
    return new Date(stateObj.attributes.next_setting);
  }

  computeOrder(risingDate, settingDate) {
    return risingDate > settingDate ? ["set", "ris"] : ["ris", "set"];
  }

  itemCaption(type) {
    if (type === "ris") {
      return "Rising";
    }
    return "Setting";
  }

  itemDate(type) {
    return type === "ris" ? this.risingDate : this.settingDate;
  }

  itemValue(type) {
    return formatTime(this.itemDate(type), "en");
  }
}