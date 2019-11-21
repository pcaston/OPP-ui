import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { OpToast } from "../components/op-toast";

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    private _discToast?: OpToast;

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
      this._discToast.dir = "ltr";
      this._discToast.text = "ui.notification_toast.connection_lost";
      this._discToast.opened = true;
    }
  };
