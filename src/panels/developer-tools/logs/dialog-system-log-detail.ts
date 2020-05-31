import {
  LitElement,
  html,
  css,
  CSSResult,
  TemplateResult,
  property,
} from "lit-element";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable";

import "../../../components/dialog/op-paper-dialog";

import { SystemLogDetailDialogParams } from "./show-dialog-system-log-detail";
import { PolymerChangedEvent } from "../../../polymer-types";
import { opStyleDialog } from "../../../resources/styles";
import { OpenPeerPower } from "../../../types";
import {
  integrationDocsUrl,
  integrationIssuesUrl,
  domainToName,
} from "../../../data/integration";
import { formatSystemLogTime } from "./util";
import { getLoggedErrorIntegration } from "../../../data/system_log";

class DialogSystemLogDetail extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() private _params?: SystemLogDetailDialogParams;

  public async showDialog(params: SystemLogDetailDialogParams): Promise<void> {
    this._params = params;
    await this.updateComplete;
  }

  protected render(): TemplateResult {
    if (!this._params) {
      return html``;
    }
    const item = this._params.item;

    const integration = getLoggedErrorIntegration(item);

    return html`
      <op-paper-dialog
        with-backdrop
        opened
        @opened-changed="${this._openedChanged}"
      >
        <h2>
          ${this.opp.localize(
            "ui.panel.developer-tools.tabs.logs.details",
            "level",
            item.level
          )}
        </h2>
        <paper-dialog-scrollable>
          <p>
            Logger: ${item.name}
            ${integration
              ? html`
                  <br />
                  Integration: ${domainToName(this.opp.localize, integration)}
                  (<a href=${integrationDocsUrl(integration)} target="_blank"
                    >documentation</a
                  >,
                  <a href=${integrationIssuesUrl(integration)} target="_blank"
                    >issues</a
                  >)
                `
              : ""}
            <br />
            ${item.count > 0
              ? html`
                  First occured:
                  ${formatSystemLogTime(item.first_occured, this.opp!.language)}
                  (${item.count} occurences) <br />
                `
              : ""}
            Last logged:
            ${formatSystemLogTime(item.timestamp, this.opp!.language)}
          </p>
          ${item.message
            ? html`
                <pre>${item.message}</pre>
              `
            : html``}
          ${item.exception
            ? html`
                <pre>${item.exception}</pre>
              `
            : html``}
        </paper-dialog-scrollable>
      </op-paper-dialog>
    `;
  }

  private _openedChanged(ev: PolymerChangedEvent<boolean>): void {
    if (!(ev.detail as any).value) {
      this._params = undefined;
    }
  }

  static get styles(): CSSResult[] {
    return [
      opStyleDialog,
      css`
        op-paper-dialog {
          direction: ltr;
        }
        a {
          color: var(--primary-color);
        }
        p {
          margin-top: 0;
        }
        pre {
          margin-bottom: 0;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-system-log-detail": DialogSystemLogDetail;
  }
}

customElements.define("dialog-system-log-detail", DialogSystemLogDetail);
