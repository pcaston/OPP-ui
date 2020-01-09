import { storeState } from "../util/op-pref-storage";
import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { OPPDomEvent } from "../common/dom/fire_event";
import { OpenPeerPower } from "../types";

interface DockSidebarParams {
  dock: OpenPeerPower["dockedSidebar"];
}

declare global {
  // for fire event
  interface OPPDomEvents {
    "opp-dock-sidebar": DockSidebarParams;
  }
  // for add event listener
  interface HTMLElementEventMap {
    "opp-dock-sidebar": OPPDomEvent<DockSidebarParams>;
  }
}

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this.addEventListener("opp-dock-sidebar", (ev) => {
        this._updateOpp({ dockedSidebar: ev.detail.dock });
        storeState(this.opp!);
      });
    }
  };
