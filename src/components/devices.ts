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
import './device-item';

// These are the elements needed by this element.
import { addToCartIcon } from './my-icons';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';

export interface Products {
  [index:string]: Product;
}
export interface Product {
  id: number;
  title: string;
  price: number;
  inventory: number;
}

@customElement('shop-products')
export class ShopProducts extends LitElement {

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
      ${Object.keys(this.products).map((key) => {
        const item = this.products[key];
        return html`
          <div>
            <device-item name="${item.title}" amount="${item.inventory}" price="${item.price}"></device-item>
            <button
                .disabled="${item.inventory === 0}"
                @click="${this._addToCart}"
                data-index="${item.id}"
                title="${item.inventory === 0 ? 'Sold out' : 'Add to cart' }">
              ${item.inventory === 0 ? 'Sold out': addToCartIcon }
            </button>
          </div>
        `;
      })}
    `;
  }
  
  private _addToCart(event: { currentTarget: { dataset: { [x: string]: any; }; }; }) {
    this.dispatchEvent(new CustomEvent("addToCart",
        {bubbles: true, composed: true, detail:{item:event.currentTarget.dataset['index']}}));
  }
}
