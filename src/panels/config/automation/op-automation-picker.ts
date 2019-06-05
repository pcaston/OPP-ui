import {
  LitElement,
  TemplateResult,
  html,
  CSSResultArray,
  css,
  property,
  customElement,
} from "lit-element";
import { ifDefined } from "lit-html/directives/if-defined";
import "@polymer/paper-fab/paper-fab";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-tooltip/paper-tooltip";
import "../../../layouts/opp-subpage";

import "../../../components/op-card";
import "../../../components/entity/op-entity-toggle";

import "../op-config-section";

import computeStateName from "../../../common/entity/compute_state_name";
import { computeRTL } from "../../../common/util/compute_rtl";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import { AutomationEntity } from "../../../data/automation";
import format_date_time from "../../../common/datetime/format_date_time";
import { fireEvent } from "../../../common/dom/fire_event";
import { repeat } from "lit-html/directives/repeat";

@customElement("op-automation-picker")
class HaAutomationPicker extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public isWide!: boolean;
  @property() public automations!: AutomationEntity[];

  protected render(): TemplateResult | void {
    return html`
      <opp-subpage
        .header=${this.opp.localize("ui.panel.config.automation.caption")}
      >
        <op-config-section .isWide=${this.isWide}>
          <div slot="header">
            ${this.opp.localize("ui.panel.config.automation.picker.header")}
          </div>
          <div slot="introduction">
            ${this.opp.localize(
              "ui.panel.config.automation.picker.introduction"
            )}
            <p>
              <a
                href="https://open-peer-power.io/docs/automation/editor/"
                target="_blank"
              >
                ${this.opp.localize(
                  "ui.panel.config.automation.picker.learn_more"
                )}
              </a>
            </p>
          </div>

          <op-card
            .heading=${this.opp.localize(
              "ui.panel.config.automation.picker.pick_automation"
            )}
          >
            ${this.automations.length === 0
              ? html`
                  <div class="card-content">
                    <p>
                      ${this.opp.localize(
                        "ui.panel.config.automation.picker.no_automations"
                      )}
                    </p>
                  </div>
                `
              : repeat(
                  this.automations,
                  (automation) => automation.entity_id,
                  (automation) => html`

                      <div class='automation'>
                        <op-entity-toggle
                          .opp=${this.opp}
                          .stateObj=${automation}
                        ></op-entity-toggle>

                        <paper-item-body two-line>
                          <div>${computeStateName(automation)}</div>
                          <div secondary>
                            Last triggered: ${
                              automation.attributes.last_triggered
                                ? format_date_time(
                                    new Date(
                                      automation.attributes.last_triggered
                                    ),
                                    this.opp.language
                                  )
                                : "never"
                            }
                          </div>
                        </paper-item-body>
                        <div class='actions'>
                          <paper-icon-button
                            .automation=${automation}
                            @click=${this._showInfo}
                            icon="opp:information-outline"
                          ></paper-icon-button>
                          <a
                            href=${ifDefined(
                              automation.attributes.id
                                ? `/config/automation/edit/${
                                    automation.attributes.id
                                  }`
                                : undefined
                            )}
                          >
                            <paper-icon-button
                              icon="opp:pencil"
                              .disabled=${!automation.attributes.id}
                            ></paper-icon-button>
                            ${
                              !automation.attributes.id
                                ? html`
                                    <paper-tooltip position="left">
                                      Only automations defined in
                                      automations.yaml are editable.
                                    </paper-tooltip>
                                  `
                                : ""
                            }
                          </a>
                        </div>
                      </div>
                    </a>
                  `
                )}
          </op-card>
        </op-config-section>

        <a href="/config/automation/new">
          <paper-fab
            slot="fab"
            ?is-wide=${this.isWide}
            icon="opp:plus"
            title=${this.opp.localize(
              "ui.panel.config.automation.picker.add_automation"
            )}
            ?rtl=${computeRTL(this.opp)}
          ></paper-fab
        ></a>
      </opp-subpage>
    `;
  }

  private _showInfo(ev) {
    const entityId = ev.currentTarget.automation.entity_id;
    fireEvent(this, "opp-more-info", { entityId });
  }

  static get styles(): CSSResultArray {
    return [
      opStyle,
      css`
        :host {
          display: block;
        }

        op-card {
          margin-bottom: 56px;
        }

        .automation {
          display: flex;
          flex-direction: horizontal;
          align-items: center;
          padding: 0 8px 0 16px;
        }

        .automation a[href] {
          color: var(--primary-text-color);
        }

        op-entity-toggle {
          margin-right: 16px;
        }

        .actions {
          display: flex;
        }

        paper-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 1;
        }

        paper-fab[is-wide] {
          bottom: 24px;
          right: 24px;
        }

        paper-fab[rtl] {
          right: auto;
          left: 16px;
        }

        paper-fab[rtl][is-wide] {
          bottom: 24px;
          right: auto;
          left: 24px;
        }

        a {
          color: var(--primary-color);
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-automation-picker": HaAutomationPicker;
  }
}
