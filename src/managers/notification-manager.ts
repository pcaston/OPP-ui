import { computeRTL } from "../common/util/compute_rtl";
import "../components/op-toast";
import { LitElement, query, property, TemplateResult, html } from "lit-element";
import { OpenPeerPower } from "../types";
// Typing
// tslint:disable-next-line: no-duplicate-imports
import { OpToast } from "../components/op-toast";

export interface ShowToastParams {
  message: string;
}

class NotificationManager extends LitElement {
  @property() public opp!: OpenPeerPower;
  @query("op-toast") private _toast!: OpToast;

  public showDialog({ message }: ShowToastParams) {
    const toast = this._toast;
    toast.setAttribute("dir", computeRTL(this.opp) ? "rtl" : "ltr");
    toast.show(message);
  }

  protected render(): TemplateResult | void {
    return html`
      <op-toast dir="[[_rtl]]" noCancelOnOutsideClick=${false}></op-toast>
    `;
  }
}

customElements.define("notification-manager", NotificationManager);
