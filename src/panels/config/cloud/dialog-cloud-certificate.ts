import {
  html,
  LitElement,
  css,
  CSSResult,
  customElement,
  property,
} from "lit-element";

import "@material/mwc-button";
import "../../../components/dialog/op-paper-dialog";
// This is not a duplicate import, one is for types, one is for element.
// tslint:disable-next-line
import { OpPaperDialog } from "../../../components/dialog/op-paper-dialog";

import { OpenPeerPower } from "../../../types";
import { opStyle } from "../../../resources/styles";
import { CloudCertificateParams as CloudCertificateDialogParams } from "./show-dialog-cloud-certificate";
import format_date_time from "../../../common/datetime/format_date_time";

@customElement("dialog-cloud-certificate")
class DialogCloudCertificate extends LitElement {
  public opp!: OpenPeerPower;

  @property()
  private _params?: CloudCertificateDialogParams;

  public async showDialog(params: CloudCertificateDialogParams) {
    this._params = params;
    // Wait till dialog is rendered.
    await this.updateComplete;
    this._dialog.open();
  }

  protected render() {
    if (!this._params) {
      return html``;
    }
    const { certificateInfo } = this._params;

    return html`
      <op-paper-dialog with-backdrop>
        <h2>Certificate Information</h2>
        <div>
          <p>
            Certificate expiration date:
            ${format_date_time(
              new Date(certificateInfo.expire_date),
              this.opp!.language
            )}<br />
            (Will be automatically renewed)
          </p>
          <p>
            Certificate fingerprint: ${certificateInfo.fingerprint}
          </p>
        </div>

        <div class="paper-dialog-buttons">
          <mwc-button @click="${this._closeDialog}">CLOSE</mwc-button>
        </div>
      </op-paper-dialog>
    `;
  }

  private get _dialog(): OpPaperDialog {
    return this.shadowRoot!.querySelector("op-paper-dialog")!;
  }

  private _closeDialog() {
    this._dialog.close();
  }

  static get styles(): CSSResult[] {
    return [
      opStyle,
      css`
        op-paper-dialog {
          width: 535px;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dialog-cloud-certificate": DialogCloudCertificate;
  }
}
