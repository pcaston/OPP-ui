import {
  LitElement,
  html,
  CSSResult,
  css,
  PropertyDeclarations,
  TemplateResult,
} from "lit-element";
import "@polymer/paper-icon-button/paper-icon-button";
import "@material/mwc-button";

import { OpenPeerPower } from "../../types";
import { fetchErrorLog } from "../../data/error_log";

class ErrorLogCard extends LitElement {
  public opp?: OpenPeerPower;
  private _errorLog?: string;

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
      _errorLog: {},
    };
  }

  protected render(): TemplateResult | void {
    return html`
      <p class="error-log-intro">
        ${this._errorLog
          ? html`
              <paper-icon-button
                icon="opp:refresh"
                @click=${this._refreshErrorLog}
              ></paper-icon-button>
            `
          : html`
              <mwc-button raised @click=${this._refreshErrorLog}>
                Load Full Open Peer Power Log
              </mwc-button>
            `}
      </p>
      <div class="error-log">${this._errorLog}</div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .error-log-intro {
        text-align: center;
        margin: 16px;
      }

      paper-icon-button {
        float: right;
      }

      .error-log {
        @apply --paper-font-code)
          clear: both;
        white-space: pre-wrap;
        margin: 16px;
      }
    `;
  }

  private async _refreshErrorLog(): Promise<void> {
    this._errorLog = "Loading error log…";
    const log = await fetchErrorLog(this.opp!);
    this._errorLog = log || "No errors have been reported.";
  }
}

customElements.define("error-log-card", ErrorLogCard);
