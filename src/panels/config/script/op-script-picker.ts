import {
  LitElement,
  html,
  CSSResultArray,
  css,
  TemplateResult,
  property,
  customElement,
} from "lit-element";
import "@polymer/paper-fab/paper-fab";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-item/paper-item-body";
import { OppEntity } from "../../../open-peer-power-js-websocket/lib";

import "../../../layouts/opp-subpage";

import "../../../components/op-card";

import "../op-config-section";

import computeStateName from "../../../common/entity/compute_state_name";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import { triggerScript } from "../../../data/script";
import { showToast } from "../../../util/toast";
import { repeat } from "lit-html/directives/repeat";

@customElement("op-script-picker")
class HaScriptPicker extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public scripts!: OppEntity[];
  @property() public isWide!: boolean;

  protected render(): TemplateResult | void {
    return html`
      <opp-subpage
        .header=${this.opp.localize("ui.panel.config.script.caption")}
      >
        <op-config-section .isWide=${this.isWide}>
          <div slot="header">Script Editor</div>
          <div slot="introduction">
            The script editor allows you to create and edit scripts. Please read
            <a
              href="https://open-peer-power.io/docs/scripts/editor/"
              target="_blank"
              >the instructions</a
            >
            to make sure that you have configured Open Peer Power correctly.
          </div>

          <op-card header="Pick script to edit">
            ${this.scripts.length === 0
              ? html`
                  <div class="card-content">
                    <p>We couldn't find any scripts.</p>
                  </div>
                `
              : repeat(
                  this.scripts,
                  (script) => script.entity_id,
                  (script) => html`
                    <div class="script">
                      <paper-icon-button
                        .script=${script}
                        icon="opp:play"
                        @click=${this._runScript}
                      ></paper-icon-button>
                      <paper-item-body>
                        <div>${computeStateName(script)}</div>
                      </paper-item-body>
                      <div class="actions">
                        <a href=${`/config/script/edit/${script.entity_id}`}>
                          <paper-icon-button
                            icon="opp:pencil"
                          ></paper-icon-button>
                        </a>
                      </div>
                    </div>
                  `
                )}
          </op-card>
        </op-config-section>

        <a href="/config/script/new">
          <paper-fab
            slot="fab"
            ?is-wide=${this.isWide}
            icon="opp:plus"
            title="Add Script"
            ?rtl=false
          ></paper-fab>
        </a>
      </opp-subpage>
    `;
  }

  private async _runScript(ev) {
    const script = ev.currentTarget.script as OppEntity;
    await triggerScript(this.opp, script.entity_id);
    showToast(this, {
      message: `Triggered ${computeStateName(script)}`,
    });
  }

  static get styles(): CSSResultArray {
    return [
      opStyle,
      css`
        :host {
          display: block;
        }

        op-card {
          padding-bottom: 8px;
          margin-bottom: 56px;
        }

        .script {
          display: flex;
          flex-direction: horizontal;
          align-items: center;
          padding: 0 8px;
          margin: 4px 0;
        }

        .script > *:first-child {
          margin-right: 8px;
        }

        .script a[href],
        paper-icon-button {
          color: var(--primary-text-color);
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
    "op-script-picker": HaScriptPicker;
  }
}
