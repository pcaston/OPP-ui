import {
  LitElement,
  html,
  CSSResult,
  css,
  TemplateResult,
  customElement,
  property,
} from "lit-element";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-spinner/paper-spinner";
import "../../../components/op-card";
import "../../../components/buttons/op-call-service-button";
import "../../../components/buttons/op-progress-button";
import { OpenPeerPower } from "../../../types";
import {
  LoggedError,
  fetchSystemLog,
  getLoggedErrorIntegration,
} from "../../../data/system_log";
import { showSystemLogDetailDialog } from "./show-dialog-system-log-detail";
import { formatSystemLogTime } from "./util";
import { domainToName } from "../../../data/integration";

@customElement("system-log-card")
export class SystemLogCard extends LitElement {
  @property() public opp!: OpenPeerPower;
  public loaded = false;
  @property() private _items?: LoggedError[];

  public async fetchData(): Promise<void> {
    this._items = undefined;
    this._items = await fetchSystemLog(this.opp!);
  }

  protected render(): TemplateResult {
    const integrations = this._items
      ? this._items.map((item) => getLoggedErrorIntegration(item))
      : [];
    return html`
      <div class="system-log-intro">
        <op-card>
          ${this._items === undefined
            ? html`
                <div class="loading-container">
                  <paper-spinner active></paper-spinner>
                </div>
              `
            : html`
                ${this._items.length === 0
                  ? html`
                      <div class="card-content">
                        ${this.opp.localize(
                          "ui.panel.developer-tools.tabs.logs.no_issues"
                        )}
                      </div>
                    `
                  : this._items.map(
                      (item, idx) => html`
                        <paper-item @click=${this._openLog} .logItem=${item}>
                          <paper-item-body two-line>
                            <div class="row">
                              ${item.message}
                            </div>
                            <div secondary>
                              ${formatSystemLogTime(
                                item.timestamp,
                                this.opp!.language
                              )}
                              –
                              ${integrations[idx]
                                ? domainToName(
                                    this.opp!.localize,
                                    integrations[idx]!
                                  )
                                : item.source}
                              (${item.level})
                              ${item.count > 1
                                ? html`
                                    -
                                    ${this.opp.localize(
                                      "ui.panel.developer-tools.tabs.logs.multiple_messages",
                                      "time",
                                      formatSystemLogTime(
                                        item.first_occured,
                                        this.opp!.language
                                      ),
                                      "counter",
                                      item.count
                                    )}
                                  `
                                : html``}
                            </div>
                          </paper-item-body>
                        </paper-item>
                      `
                    )}

                <div class="card-actions">
                  <op-call-service-button
                    .opp=${this.opp}
                    domain="system_log"
                    service="clear"
                    >${this.opp.localize(
                      "ui.panel.developer-tools.tabs.logs.clear"
                    )}</op-call-service-button
                  >
                  <op-progress-button @click=${this.fetchData}
                    >${this.opp.localize(
                      "ui.panel.developer-tools.tabs.logs.refresh"
                    )}</op-progress-button
                  >
                </div>
              `}
        </op-card>
      </div>
    `;
  }

  protected firstUpdated(changedProps): void {
    super.firstUpdated(changedProps);
    this.fetchData();
    this.loaded = true;
    this.addEventListener("opp-service-called", (ev) => this.serviceCalled(ev));
  }

  protected serviceCalled(ev): void {
    // Check if this is for us
    if (ev.detail.success && ev.detail.domain === "system_log") {
      // Do the right thing depending on service
      if (ev.detail.service === "clear") {
        this._items = [];
      }
    }
  }

  private _openLog(ev: Event): void {
    const item = (ev.currentTarget as any).logItem;
    showSystemLogDetailDialog(this, { item });
  }

  static get styles(): CSSResult {
    return css`
      op-card {
        padding-top: 16px;
      }

      paper-item {
        cursor: pointer;
      }

      .system-log-intro {
        margin: 16px;
      }

      .loading-container {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "system-log-card": SystemLogCard;
  }
}