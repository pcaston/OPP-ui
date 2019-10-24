import { UpdatingElement, Constructor, PropertyValues } from "lit-element";
import { OpenPeerPower } from "../types";

export interface ProvideOppElement {
  provideOpp(element: HTMLElement);
}

/* tslint:disable */

export const ProvideOppLitMixin = <T extends UpdatingElement>(
  superClass: Constructor<T>
): Constructor<T & ProvideOppElement> =>
  // @ts-ignore
  class extends superClass {
    protected opp!: OpenPeerPower;
    private __provideOpp: HTMLElement[] = [];

    public provideOpp(el) {
      this.__provideOpp.push(el);
      el.opp = this.opp;
    }

    protected updated(changedProps: PropertyValues) {
      super.updated(changedProps);

      if (changedProps.has("opp")) {
        this.__provideOpp.forEach((el) => {
          (el as any).opp = this.opp;
        });
      }
    }
  };
