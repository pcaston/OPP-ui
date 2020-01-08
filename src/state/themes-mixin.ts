import { applyThemesOnElement } from "../common/dom/apply_themes_on_element";
import { storeState } from "../util/op-pref-storage";
import { subscribeThemes } from "../data/ws-themes";
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
      this.addEventListener("settheme", (ev) => {
        this._updateOpp({ selectedTheme: ev.detail });
        this._applyTheme();
        storeState(this.opp!);
      });
    }

    protected oppConnected() {
      super.oppConnected();

      subscribeThemes(this.opp!.connection, (themes) => {
        this._updateOpp({ themes });
        this._applyTheme();
      });
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
