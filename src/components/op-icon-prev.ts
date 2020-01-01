import "@polymer/iron-icon/iron-icon";
// Not duplicate, this is for typing.
// tslint:disable-next-line
import { OppIcon } from "./op-icon";

export class OppIconPrev extends OppIcon {
  public connectedCallback() {
    this.icon =
      window.getComputedStyle(this).direction === "ltr"
        ? "opp:chevron-left"
        : "opp:chevron-right";

    // calling super after setting icon to have it consistently show the icon (otherwise not always shown)
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-icon-prev": OppIconPrev;
  }
}

customElements.define("op-icon-prev", OppIconPrev);
