import {
  Constructor,
} from "lit-element";
import { OpenPeerPower } from "../types";

/* tslint:disable */

export class OppBaseEl {
  protected opp?: OpenPeerPower;
}

export default <T>(superClass: Constructor<T>): Constructor<T & OppBaseEl> =>
  // @ts-ignore
  class extends superClass {
    @property() protected opp!: OpenPeerPower;
  };
