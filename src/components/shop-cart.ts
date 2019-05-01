/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, customElement } from 'lit-element';

// These are the elements needed by this element.
import { removeFromCartIcon } from './my-icons';
import './device-item';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';
import { Devices} from './device-list';

export interface Cart {
  [index:number]: CartItem;
  addedIds: number [];
  quantityById: number [];
 }

export interface CartItem {
  id: number;
  title: string;
  amount: number;
  cost: number;
}

@customElement('shop-cart')
export class ShopCart extends LitElement {
  @property({type: [Object]})
  private cart: Cart = { addedIds: [], quantityById: [] }

  @property({type: Object})
  private devices: Devices = {};

  static get styles() {
    return [
      ButtonSharedStyles,
      css`
        :host {
          display: block;
        }
      `
    ];
  }

  protected render() {
    return html`
      <p ?hidden="${this.cart.addedIds.length !== 0}">Please add some devices to cart.</p>
      ${this._displayCart(this.cart).map((item: CartItem) =>
        html`
          <div>
            <device-item .name="${item.title}" .amount="${item.amount}" .cost="${item.cost}"></device-item>
            <button
              @click="${this._removeFromCart}"
              data-index="${item.id}"
              title="Remove from cart">
              ${removeFromCartIcon}
            </button>
          </div>
        `
      )}
    `;
  }

  private _displayCart(cart: Cart) {
    const items = [];
    for (let id of cart.addedIds) {
      const item = this.devices[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], cost: item.cost});
    }
    return items;
  }
   
  private _removeFromCart(event: { currentTarget: { dataset: { [x: string]: any; }; }; }) {
    this.dispatchEvent(new CustomEvent('removeFromCart',
        {bubbles: true, composed: true, detail:{item:event.currentTarget.dataset['index']}}));
    }
}
