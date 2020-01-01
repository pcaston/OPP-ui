import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-relative-time";

import LocalizeMixin from "../../../mixins/localize-mixin";
import formatTime from "../../../common/datetime/format_time";

@customElement("more-info-sun")
export class MoreInfoSun extends LocalizeMixin(LitElement) {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property() public stateObj?: SunEntity;

  protected render(): TemplateResult | void {
    if (!this.opp || !this.stateObj) {
      return html``;
    }

    const risingDate = new Date(this.stateObj.attributes.next_rising);
    const settingDate = new Date(this.stateObj.attributes.next_setting);
    const order = risingDate > settingDate ? ["set", "ris"] : ["ris", "set"];

    return html`
      ${order.map((item) => {
        return html`
          <div class="row">
            <div class="key">
              <span
                >${item === "ris"
                  ? "Rising"
                  : "Setting"
                    }</span
              >
              <op-relative-time
                .opp=${this.opp}
                .datetimeObj=${item === "ris" ? risingDate : settingDate}
              ></op-relative-time>
            </div>
            <div class="value">
              ${formatTime(
                item === "ris" ? risingDate : settingDate,
                "en"
              )}
            </div>
          </div>
        `;
      })}
      <div class="row">
        <div class="key">
          Elevation
        </div>
        <div class="value">${this.stateObj.attributes.elevation}</div>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .row {
        margin: 0 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    `;
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
      return this.localize("ui.dialogs.more_info_control.sun.rising");
    }
    return this.localize("ui.dialogs.more_info_control.sun.setting");
  }

  itemDate(type) {
    return type === "ris" ? this.risingDate : this.settingDate;
  }

  itemValue(type) {
    return formatTime(this.itemDate(type), this.opp.language);
  }
}
