import {
  Constructor,
  // @ts-ignore
  property,
} from "lit-element";
import { Auth, Connection } from "../open-peer-power-js-websocket/lib";
import { OpenPeerPower } from "../types";

/* tslint:disable */

export class OppBaseEl {
  protected opp?: OpenPeerPower;
  protected _pendingOpp: Partial<OpenPeerPower> = {};
  protected initializeOpp(_auth: Auth, _conn: Connection) {}
  protected oppConnected() {}
  protected oppReconnected() {}
  protected oppDisconnected() {}
  public provideOpp(_el: HTMLElement) {}
  protected _updateOpp(_obj: Partial<OpenPeerPower>) {}
}

export default <T>(superClass: Constructor<T>): Constructor<T & OppBaseEl> =>
  // @ts-ignore
  class extends superClass {
    protected _pendingOpp: Partial<OpenPeerPower> = {};
    private __provideOpp: HTMLElement[] = [];
    // @ts-ignore
    @property() protected opp: OpenPeerPower;

    // Exists so all methods can safely call super method
    protected oppConnected() {
      // tslint:disable-next-line
    }

    protected oppReconnected() {
      // tslint:disable-next-line
    }

    protected oppDisconnected() {
      // tslint:disable-next-line
    }

    protected panelUrlChanged(_newPanelUrl) {
      // tslint:disable-next-line
    }

    protected oppChanged(opp, _oldOpp) {
      this.__provideOpp.forEach((el) => {
        (el as any).opp = opp;
      });
    }

    public provideOpp(el) {
      this.__provideOpp.push(el);
      el.opp = this.opp;
    }

    protected async _updateOpp(obj: Partial<OpenPeerPower>) {
      if (!this.opp) {
        this._pendingOpp = { ...this._pendingOpp, ...obj };
        return;
      }
      this.opp = { ...this.opp, ...obj };
    }
  };
