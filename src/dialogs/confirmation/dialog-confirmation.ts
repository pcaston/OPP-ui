import {
  LitElement,
  html,
  css,
  CSSResult,
  TemplateResult,
  customElement,
  property,
} from "lit-element";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable";
import "@polymer/paper-input/paper-input";

import "../../components/dialog/op-paper-dialog";
import "../../components/op-switch";

import { OpenPeerPower } from "../../types";
import { ConfirmationDialogParams } from "./show-dialog-confirmation";
import { PolymerChangedEvent } from "../../polymer-types";
import { opStyleDialog } from "../../resources/styles";

@customElement("dialog-confirmation")
class DialogConfirmation extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() private _params?: ConfirmationDialogParams;

  public async showDialog(params: ConfirmationDialogParams): Promise<void> {
    this._params = params;
  }

  protected render(): TemplateResult | void {
    if (!this._params) {
      return html``;
    }

    return html`
      <op-paper-dialog
        with-backdrop
        opened
        modal
        @opened-changed="${this._openedChanged}"
      >
        <h2>
          ${this._params.title
            ? this._params.title
            : this.opp.localize("ui.dialogs.confirmation.title")}
        </h2>
        <paper-dialog-scrollable>
          <p>${this._params.text}</p>
        </paper-dialog-scrollable>
        <div class="paper-dialog-buttons">
          <mwc-button @click="${this._dismiss}">
            ${this._params.cancelBtnText
              ? this._params.cancelBtnText
              : this.opp.localize("ui.dialogs.confirmation.cancel")}
          </mwc-button>
          <mwc-button @click="${this._confirm}">
            ${this._params.confirmBtnText
              ? this._params.confirmBtnText
              : this.opp.localize("ui.dialogs.confirmation.ok")}
          </mwc-button>
        </div>
      </op-paper-dialog>
    `;
  }

  private async _dismiss(): Promise<void> {
    this._params = undefined;
  }

  private async _confirm(): Promise<void> {
    this._params!.confirm();
    this._dismiss();
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
          min-width: 400px;
          max-width: 500px;
        }
        @media (max-width: 400px) {
          op-paper-dialog {
            min-width: initial;
          }
        }
        p {
          margin: 0;
          padding-top: 6px;
          padding-bottom: 24px;
          color: var(--primary-text-color);
        }
        .secondary {
          color: var(--secondary-text-color);
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-confirmation": DialogConfirmation;
  }
}
