import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { OpenPeerPower, SunEntity} from "../../../types";
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
  @property({ type : Array }) stateObj!: SunEntity;
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
    debugger;
    const items: string[] = this.computeOrder(this.risingDate, this.settingDate);
    return html`
      ${Object.keys(items).map((key) => {
        const item: string = items[key];
        return html`
          <div class="data-entry layout justified horizontal">
            <div class="key">
              <span>${this.itemCaption(item)}</span>
                <op-relative-time
                  .opp="${this.opp}"
                  .datetime-obj="${this.itemDate(item)}"
                ></op-relative-time>
              </div>
            <div class="value">${this.itemValue(item)}</div>
          </div>
        `;
      )}
      <div class="data-entry layout justified horizontal">
        <div class="key">elevation</div>
        <div class="value">elevation</div>
      </div>
    `;
  }

  computeRising(stateObj: SunEntity) {
    return new Date(stateObj.attributes.next_rising);
  }

  computeSetting(stateObj: SunEntity) {
    return new Date(stateObj.attributes.next_setting);
  }

  computeOrder(risingDate: object, settingDate: object) {
    return risingDate > settingDate ? ["set", "ris"] : ["ris", "set"];
  }

  itemCaption(type: string) {
    if (type === "ris") {
      return "Rising";
    }
    return "Setting";
  }

  itemDate(type: string) {
    return type === "ris" ? this.risingDate : this.settingDate;
  }

  itemValue(type: string) {
    return formatTime(this.itemDate(type), "en");
  }
}