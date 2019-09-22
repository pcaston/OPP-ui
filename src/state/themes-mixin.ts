import applyThemesOnElement from "../common/dom/apply_themes_on_element";
import { storeState } from "../util/op-pref-storage";
import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { OPPDomEvent } from "../common/dom/fire_event";

declare global {
  // for add event listener
  interface HTMLElementEventMap {
    settheme: OPPDomEvent<string>;
  }
}

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
    }

    protected oppConnected() {
      super.oppConnected();
    }

    private _applyTheme() {
      applyThemesOnElement(
        document.documentElement,
        this.opp!.themes,
        this.opp!.selectedTheme,
        true
      );
    }
  };
