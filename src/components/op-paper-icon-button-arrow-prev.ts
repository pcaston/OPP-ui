import { Constructor } from "lit-element";
import "@polymer/paper-icon-button/paper-icon-button";
// Not duplicate, this is for typing.
// tslint:disable-next-line
import { PaperIconButtonElement } from "@polymer/paper-icon-button/paper-icon-button";

const paperIconButtonClass = customElements.get(
  "paper-icon-button"
) as Constructor<PaperIconButtonElement>;

export class OpPaperIconButtonArrowPrev extends paperIconButtonClass {
  public oppio?: boolean;

  public connectedCallback() {
    this.icon =
      window.getComputedStyle(this).direction === "ltr"
        ? this.oppio
          ? "oppio:arrow-left"
          : "opp:arrow-left"
        : this.oppio
        ? "oppio:arrow-right"
        : "opp:arrow-right";

    // calling super after setting icon to have it consistently show the icon (otherwise not always shown)
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-paper-icon-button-arrow-prev": OpPaperIconButtonArrowPrev;
  }
}

customElements.define(
  "op-paper-icon-button-arrow-prev",
  OpPaperIconButtonArrowPrev
);
