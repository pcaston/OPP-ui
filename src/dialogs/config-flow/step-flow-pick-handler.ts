import {
  LitElement,
  TemplateResult,
  html,
  css,
  customElement,
  CSSResult,
} from "lit-element";
import "@polymer/paper-spinner/paper-spinner-lite";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import { OpenPeerPower } from "../../types";
import { createConfigFlow } from "../../data/config_entries";
import { fireEvent } from "../../common/dom/fire_event";
import "../../components/opp-icon-next";

@customElement("step-flow-pick-handler")
class StepFlowPickHandler extends LitElement {
  public opp!: OpenPeerPower;
  public handlers!: string[];

  protected render(): TemplateResult | void {
    return html`
      <h2>"ui.panel.config.integrations.new"</h2>
      <div>
        ${this.handlers.map(
          (handler) =>
            html`
              <paper-item @click=${this._handlerPicked} .handler=${handler}>
                <paper-item-body>
                  `component.${handler}.config.title`
                </paper-item-body>
                <opp-icon-next></opp-icon-next>
              </paper-item>
            `
        )}
      </div>
    `;
  }

  private async _handlerPicked(ev) {
    fireEvent(this, "flow-update", {
      stepPromise: createConfigFlow(this.opp, ev.currentTarget.handler),
    });
  }

  static get styles(): CSSResult {
    return css`
      h2 {
        padding-left: 16px;
      }
      div {
        overflow: auto;
        max-height: 600px;
      }
      paper-item {
        cursor: pointer;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "step-flow-pick-handler": StepFlowPickHandler;
  }
}
