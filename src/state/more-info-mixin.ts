import { Constructor, LitElement } from "lit-element";

import { OppBaseEl } from "./opp-base-mixin";
//import "../dialogs/opp-more-info-dialog";


declare global {
  // for fire event
  interface OPPDomEvents {
    "opp-more-info": {
      entityId: string | null;
    };
  }
}

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    private _moreInfoEl?: any;

    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this.addEventListener("opp-more-info", (e) => this._handleMoreInfo(e));
    }

    private async _handleMoreInfo(ev) {
      debugger;
      if (!this._moreInfoEl) {
        import("../dialogs/opp-more-info-dialog");
        this._moreInfoEl = document.createElement("opp-more-info-dialog");
        this.shadowRoot!.appendChild(this._moreInfoEl);
        this.provideOpp(this._moreInfoEl);
      }
      this._updateOpp(this._moreInfoEl, { moreInfoEntityId: ev.detail.entityId });
    }
  };
