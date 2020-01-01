import { Constructor, LitElement } from "lit-element";

import { OppBaseEl } from "./opp-base-mixin";

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
    private _moreInfoEntityId?: any;

    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this.addEventListener("opp-more-info", (e) => this._handleMoreInfo(e));
    }

    private async _handleMoreInfo(ev) {
      if (!this._moreInfoEntityId) {
        import("../dialogs/op-more-info-dialog");
        this._moreInfoEntityId = document.createElement("op-more-info-dialog");
        this.shadowRoot!.appendChild(this._moreInfoEntityId);
        this.provideOpp(this._moreInfoEntityId);
      }
      this._updateOpp(this._moreInfoEntityId, { moreInfoEntityId: ev.detail.entityId });
    }
  };
