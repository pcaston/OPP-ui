import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { OpenPeerPower, SunEntity} from "../../../types";
import {
  LitElement,
  css,
  html,
  property,
  TemplateResult,
} from "lit-element";

import "../../../components/op-relative-time";

import formatTime from "../../../common/datetime/format_time";
import { litLocalizeLiteMixin } from "../../../mixins/lit-localize-lite-mixin";

export class MoreInfoSun extends litLocalizeLiteMixin(LitElement) {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) stateObj!: SunEntity;
  @property({ type : Object }) risingDate!: Date;
  @property({ type : Object }) settingDate!: Date;
  static get styles() {
    return [
      css`
      <style include="iron-flex iron-flex-alignment"></style>
      `
    ];
  }

  protected render(): TemplateResult | void  {
    debugger;
    this.risingDate = this.computeRising(this.stateObj);
    this.settingDate = this.computeSetting(this.stateObj);
    const items: string[] = this.computeOrder(this.risingDate, this.settingDate);
    return html`
      <div>
        <p>Show something!</p>
      </div>
      ${Object.keys(items).map((key) => {
        const item: string = items[key];
        return html`
          <div class="data-entry layout justified horizontal">
            <div class="key">
              <span>${this.localize(this.itemCaption(item))}</span>
                <op-relative-time
                  .opp="${this.opp}"
                  .datetime-obj="${this.itemDate(item)}"
                ></op-relative-time>
              </div>
            <div class="value">${this.itemValue(item)}</div>
          </div>
        `;
        })
      }
      <div class="data-entry layout justified horizontal">
        <div class="key">elevation
          ${this.localize('ui.dialogs.more_info_control.sun.elevation')}
        </div>
        <div class="value">
          ${this.stateObj.attributes.elevation}
        </div>
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
      return this.localize("ui.dialogs.more_info_control.sun.rising");
    }
    return this.localize("ui.dialogs.more_info_control.sun.setting");
  }

  itemDate(type: string) {
    return type === "ris" ? this.risingDate : this.settingDate;
  }

  itemValue(type: string) {
    return formatTime(this.itemDate(type), this.opp.language);
  }
}
customElements.define("more-info-sun", MoreInfoSun);