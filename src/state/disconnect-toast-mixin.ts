import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { showToast } from "../util/toast";

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      // Need to load in advance because when disconnected, can't dynamically load code.
      import(/* webpackChunkName: "notification-manager" */ "../managers/notification-manager");
    }

    protected oppReconnected() {
      super.oppReconnected();

      showToast(this, {
        message: "",
        duration: 1,
      });
    }

    protected oppDisconnected() {
      super.oppDisconnected();

      showToast(this, {
        message: this.opp!.localize("ui.notification_toast.connection_lost"),
        duration: 0,
        dismissable: false,
      });
    }
  };
