import {
  Constructor,
  property,
} from "lit-element";
import { OpenPeerPower } from "../types";

/* tslint:disable */

export class OppBaseEl {
  protected opp?: OpenPeerPower;
  protected _pendingOpp: Partial<OpenPeerPower> = {};
  public provideOpp(_el: HTMLElement) {}
  protected _updateOpp(_el: HTMLElement, _obj: Partial<OpenPeerPower>) {}
}

export default <T>(superClass: Constructor<T>): Constructor<T & OppBaseEl> =>
  // @ts-ignore
  class extends superClass {
    protected _pendingOpp: Partial<OpenPeerPower> = {};
    private __provideOpp: HTMLElement[] = [];
    // @ts-ignore
    @property() protected opp!: OpenPeerPower;

    public provideOpp(_el) {
      this.__provideOpp.push(_el);
      _el.opp = this.opp;
    }

    protected async _updateOpp(_el: HTMLElement, obj: Partial<OpenPeerPower>) {
      if (!this.opp) {
        this._pendingOpp = { ...this._pendingOpp, ...obj };
        return;
      }
      _el.opp = { ...this.opp, ...obj };
    }
  };
