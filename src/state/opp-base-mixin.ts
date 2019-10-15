import {
  Constructor,
} from "lit-element";
import { OpenPeerPower } from "../types";

/* tslint:disable */

export class OppBaseEl {
  protected opp?: OpenPeerPower;
  protected _pendingOpp: Partial<OpenPeerPower> = {};
  public provideOpp(_el: HTMLElement) {}
  protected _updateOpp(_obj: Partial<OpenPeerPower>) {}
}

export default <T>(superClass: Constructor<T>): Constructor<T & OppBaseEl> =>
  // @ts-ignore
  class extends superClass {
    protected _pendingOpp: Partial<OpenPeerPower> = {};
    private __provideOpp: HTMLElement[] = [];
    @property() protected opp!: OpenPeerPower;

    public provideOpp(el) {
      this.__provideOpp.push(el);
      el.hass = this.opp;
    }

    protected async _updateHass(obj: Partial<OpenPeerPower>) {
      if (!this.opp) {
        this._pendingOpp = { ...this._pendingOpp, ...obj };
        return;
      }
      this.opp = { ...this.opp, ...obj };
    }
  };
