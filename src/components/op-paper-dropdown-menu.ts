import "@polymer/paper-dropdown-menu/paper-dropdown-menu";
import { PolymerElement } from "@polymer/polymer";
import { Constructor } from "../types";

const paperDropdownClass = customElements.get(
  "paper-dropdown-menu"
) as Constructor<PolymerElement>;

// patches paper drop down to properly support RTL - https://github.com/PolymerElements/paper-dropdown-menu/issues/183
export class OpPaperDropdownClass extends paperDropdownClass {
  public ready() {
    super.ready();
    // wait to check for direction since otherwise direction is wrong even though top level is RTL
    setTimeout(() => {
      if (window.getComputedStyle(this).direction === "rtl") {
        this.style.textAlign = "right";
      }
    }, 100);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-paper-dropdown-menu": OpPaperDropdownClass;
  }
}

customElements.define("op-paper-dropdown-menu", OpPaperDropdownClass);
