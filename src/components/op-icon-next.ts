import "@polymer/iron-icon/iron-icon";
// Not duplicate, this is for typing.
// tslint:disable-next-line
import { OppIcon } from "./op-icon";

export class OpIconNext extends OppIcon {
  public connectedCallback() {
    this.icon =
      window.getComputedStyle(this).direction === "ltr"
        ? "opp:chevron-right"
        : "opp:chevron-left";

    // calling super after setting icon to have it consistently show the icon (otherwise not always shown)
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-icon-next": OpIconNext;
  }
}

customElements.define("op-icon-next", OpIconNext);
