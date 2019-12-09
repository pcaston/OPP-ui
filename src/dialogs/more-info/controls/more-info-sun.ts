import {
  property,
  LitElement,
  TemplateResult,
  html,
  customElement,
  CSSResult,
  css,
} from "lit-element";
import { OpenPeerPower, SunEntity} from "../../../types";

import "../../../components/op-relative-time";

import formatTime from "../../../common/datetime/format_time";

@customElement("more-info-sun")
export class MoreInfoSun extends LitElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property() public stateObj?: OppEntity;

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
                  ? "ui.dialogs.more_info_control.sun.rising"
                  : "ui.dialogs.more_info_control.sun.setting"
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
          "ui.dialogs.more_info_control.sun.elevation"
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
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "more-info-sun": MoreInfoSun;
  }
}
