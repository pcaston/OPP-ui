import "@polymer/iron-icon/iron-icon";
// Not duplicate, this is for typing.
// tslint:disable-next-line
import { HaIcon } from "./op-icon";

export class HaIconNext extends HaIcon {
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
    "op-icon-next": HaIconNext;
  }
}

customElements.define("op-icon-next", HaIconNext);
