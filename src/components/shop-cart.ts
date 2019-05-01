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
<<<<<<< HEAD
import { Products} from './devices';
=======
import { Products} from './device-list';
>>>>>>> 667a2f92e26300a4e2ada93a50c00bd864a45993

export interface Cart {
  [index:number]: CartItem;
  addedIds: number [];
  quantityById: number [];
 }

export interface CartItem {
  id: number;
  title: string;
  amount: number;
  price: number;
}

@customElement('shop-cart')
export class ShopCart extends LitElement {
  @property({type: [Object]})
  private cart: Cart = { addedIds: [], quantityById: [] }

  @property({type: Object})
  private products: Products = {};

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
      <p ?hidden="${this.cart.addedIds.length !== 0}">Please add some products to cart.</p>
      ${this._displayCart(this.cart).map((item: CartItem) =>
        html`
          <div>
            <device-item .name="${item.title}" .amount="${item.amount}" .price="${item.price}"></device-item>
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
      const item = this.products[id];
      items.push({id: item.id, title: item.title, amount: cart.quantityById[id], price: item.price});
    }
    return items;
  }
   
  private _removeFromCart(event: { currentTarget: { dataset: { [x: string]: any; }; }; }) {
    this.dispatchEvent(new CustomEvent('removeFromCart',
        {bubbles: true, composed: true, detail:{item:event.currentTarget.dataset['index']}}));
    }
}
