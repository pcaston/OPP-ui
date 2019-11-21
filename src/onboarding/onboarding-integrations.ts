import {
  LitElement,
  TemplateResult,
  html,
  customElement,
  PropertyValues,
  property,
  CSSResult,
  css,
} from "lit-element";
import "@material/mwc-button/mwc-button";
import {
  loadConfigFlowDialog,
  showConfigFlowDialog,
} from "../dialogs/config-flow/show-dialog-config-flow";
import { OpenPeerPower } from "../types";
import {
  getConfigFlowsInProgress,
  getConfigEntries,
  ConfigEntry,
  ConfigFlowProgress,
} from "../data/config_entries";
import { compare } from "../common/string/compare";
import "./integration-badge";
import { debounce } from "../common/util/debounce";
import { fireEvent } from "../common/dom/fire_event";
import { onboardIntegrationStep } from "../data/onboarding";
import { genClientId } from "../open-peer-power-js-websocket/lib";

@customElement("onboarding-integrations")
class OnboardingIntegrations extends LitElement {
  @property() public opp!: OpenPeerPower;

  @property() private _entries?: ConfigEntry[];
  @property() private _discovered?: ConfigFlowProgress[];
  private _unsubEvents?: () => void;

  public connectedCallback() {
    super.connectedCallback();
    this.opp.connection
      .subscribeEvents(
        debounce(() => this._loadData(), 500),
        "config_entry_discovered"
      )
      .then((unsub) => {
        this._unsubEvents = unsub;
      });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubEvents) {
      this._unsubEvents();
    }
  }

  protected render(): TemplateResult | void {
    if (!this._entries || !this._discovered) {
      return html``;
    }
    // Render discovered and existing entries together sorted by title.
    const entries: Array<[string, TemplateResult]> = this._entries.map(
      (entry) => {
        const title = 
          `component.${entry.domain}.config.title`
        ;
        return [
          title,
          html`
            <integration-badge
              .title=${title}
              icon="opp:check"
            ></integration-badge>
          `,
        ];
      }
    );
    const discovered: Array<[string, TemplateResult]> = this._discovered.map(
      (flow) => {
        const title = flow;
        return [
          title,
          html`
            <button .flowId=${flow.flow_id} @click=${this._continueFlow}>
              <integration-badge
                clickable
                .title=${title}
                icon="opp:plus"
              ></integration-badge>
            </button>
          `,
        ];
      }
    );
    const content = [...entries, ...discovered]
      .sort((a, b) => compare(a[0], b[0]))
      .map((item) => item[1]);

    return html`
      <p>
      Devices and services are represented in Open Peer Power as integrations. You can set them up now, or do it later from the configuration screen.
      </p>
      <div class="badges">
        ${content}
        <button @click=${this._createFlow}>
          <integration-badge
            clickable
            title="More"
            icon="opp:dots-horizontal"
          ></integration-badge>
        </button>
      </div>
      <div class="footer">
        <mwc-button @click=${this._finish}>
          Finish
        </mwc-button>
      </div>
    `;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    loadConfigFlowDialog();
    this._loadData();
    /* polyfill for paper-dropdown */
    import(/* webpackChunkName: "polyfill-web-animations-next" */ "web-animations-js/web-animations-next-lite.min");
  }

  private _createFlow() {
    showConfigFlowDialog(this, {
      dialogClosedCallback: () => this._loadData(),
    });
  }

  private _continueFlow(ev) {
    showConfigFlowDialog(this, {
      continueFlowId: ev.currentTarget.flowId,
      dialogClosedCallback: () => this._loadData(),
    });
  }

  private async _loadData() {
    const [discovered, entries] = await Promise.all([
      getConfigFlowsInProgress(this.opp!),
      getConfigEntries(this.opp!),
    ]);
    this._discovered = discovered;
    this._entries = entries;
  }

  private async _finish() {
    const result = await onboardIntegrationStep(this.opp, {
      client_id: genClientId(),
    });
    fireEvent(this, "onboarding-step", {
      type: "integration",
      result,
    });
  }

  static get styles(): CSSResult {
    return css`
      .badges {
        margin-top: 24px;
      }
      .badges > * {
        width: 24%;
        min-width: 90px;
        margin-bottom: 24px;
      }
      button {
        display: inline-block;
        cursor: pointer;
        padding: 0;
        border: 0;
        background: 0;
        font: inherit;
      }
      .footer {
        text-align: right;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "onboarding-integrations": OnboardingIntegrations;
  }
}
