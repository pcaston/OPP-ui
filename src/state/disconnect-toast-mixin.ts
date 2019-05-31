import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { HaToast } from "../components/op-toast";
import { computeRTL } from "../common/util/compute_rtl";

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    private _discToast?: HaToast;

    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      // Need to load in advance because when disconnected, can't dynamically load code.
      import(/* webpackChunkName: "op-toast" */ "../components/op-toast");
    }

    protected oppReconnected() {
      super.oppReconnected();
      if (this._discToast) {
        this._discToast.opened = false;
      }
    }

    protected oppDisconnected() {
      super.oppDisconnected();
      if (!this._discToast) {
        const el = document.createElement("op-toast");
        el.duration = 0;
        this._discToast = el;
        this.shadowRoot!.appendChild(el as any);
      }
      this._discToast.dir = computeRTL(this.opp!);
      this._discToast.text = this.opp!.localize(
        "ui.notification_toast.connection_lost"
      );
      this._discToast.opened = true;
    }
  };
