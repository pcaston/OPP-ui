import {
  LitElement,
  TemplateResult,
  html,
  customElement,
  property,
  CSSResultArray,
  css,
} from "lit-element";
import "@material/mwc-button";

import {
  ConfigFlowStepExternal,
  DataEntryFlowProgressedEvent,
  fetchConfigFlow,
} from "../../data/config_entries";
import { OpenPeerPower } from "../../types";
import { fireEvent } from "../../common/dom/fire_event";
import { configFlowContentStyles } from "./styles";

@customElement("step-flow-external")
class StepFlowExternal extends LitElement {
  @property()
  public opp!: OpenPeerPower;

  @property()
  private step!: ConfigFlowStepExternal;

  protected render(): TemplateResult | void {
    const step = this.step;

    const description = 
      `component.${step.handler}.config.${step.step_id}.description`,
      step.description_placeholders;

    return html`
      <h2>
          `component.${step.handler}.config.step.${step.step_id}.title`
      </h2>
      <div class="content">
        <p>
            "ui.panel.config.integrations.config_flow.external_step.description"
        </p>
        ${description
          ? html`
              <op-markdown .content=${description} allow-svg></op-markdown>
            `
          : ""}
        <div class="open-button">
          <a href=${this.step.url} target="_blank">
            <mwc-button raised>
                "ui.panel.config.integrations.config_flow.external_step.open_site"
            </mwc-button>
          </a>
        </div>
      </div>
    `;
  }

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.opp.connection.subscribeEvents<DataEntryFlowProgressedEvent>(
      async (ev) => {
        if (ev.data.flow_id !== this.step.flow_id) {
          return;
        }

        const step = await fetchConfigFlow(this.opp, this.step.flow_id);
        fireEvent(this, "flow-update", { step });
      },
      "data_entry_flow_progressed"
    );
    window.open(this.step.url);
  }

  static get styles(): CSSResultArray {
    return [
      configFlowContentStyles,
      css`
        .open-button {
          text-align: center;
          padding: 24px 0;
        }
        .open-button a {
          text-decoration: none;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "step-flow-external": StepFlowExternal;
  }
}
