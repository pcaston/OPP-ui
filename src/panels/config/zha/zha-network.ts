import "../../../components/buttons/op-call-service-button";
import "../../../components/op-service-description";
import "../op-config-section";
import "@material/mwc-button";
import "@polymer/paper-card/paper-card";
import "@polymer/paper-icon-button/paper-icon-button";

import {
  css,
  CSSResult,
  html,
  LitElement,
  PropertyDeclarations,
  TemplateResult,
} from "lit-element";

import { navigate } from "../../../common/navigate";
import { opStyle } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";

export class ZHANetwork extends LitElement {
  public opp?: OpenPeerPower;
  public isWide?: boolean;
  private _showHelp: boolean;

  constructor() {
    super();
    this._showHelp = false;
  }

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
      isWide: {},
      _showHelp: {},
      _joinParams: {},
    };
  }

  protected render(): TemplateResult | void {
    return html`
      <op-config-section .isWide="${this.isWide}">
        <div style="position: relative" slot="header">
          <span>Network Management</span>
          <paper-icon-button
            class="toggle-help-icon"
            @click="${this._onHelpTap}"
            icon="opp:help-circle"
          ></paper-icon-button>
        </div>
        <span slot="introduction">Commands that affect entire network</span>

        <paper-card class="content">
          <div class="card-actions">
            <mwc-button @click=${this._onAddDevicesClick}>
              Add Devices
            </mwc-button>
            ${this._showHelp
              ? html`
                  <op-service-description
                    .opp="${this.opp}"
                    domain="zha"
                    service="permit"
                    class="help-text2"
                  />
                `
              : ""}
          </div>
        </paper-card>
      </op-config-section>
    `;
  }

  private _onHelpTap(): void {
    this._showHelp = !this._showHelp;
  }

  private _onAddDevicesClick() {
    navigate(this, "add");
  }

  static get styles(): CSSResult[] {
    return [
      opStyle,
      css`
        .content {
          margin-top: 24px;
        }

        paper-card {
          display: block;
          margin: 0 auto;
          max-width: 600px;
        }

        .card-actions.warning op-call-service-button {
          color: var(--google-red-500);
        }

        .toggle-help-icon {
          position: absolute;
          top: -6px;
          right: 0;
          color: var(--primary-color);
        }

        op-service-description {
          display: block;
          color: grey;
        }

        [hidden] {
          display: none;
        }

        .help-text2 {
          color: grey;
          padding: 16px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zha-network": ZHANetwork;
  }
}

customElements.define("zha-network", ZHANetwork);
