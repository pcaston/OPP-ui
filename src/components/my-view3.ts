/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, property, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the elements needed by this element.
import './shop-products';
import './shop-cart';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { ButtonSharedStyles } from './button-shared-styles';
import { addToCartIcon } from './my-icons';
import { Products, Product } from './shop-products';
import { Cart } from './shop-cart';

@customElement('my-view3')
export class MyView3 extends PageViewElement {

  @property({type: Object})
  private _cart: Cart = { addedIds: [], quantityById: [] }

  @property({type: String})
  private _error = '';

  @property({type: Object})
  private products: Products = this._getAllProducts();

  @property({type: Object})
  private ws: WebSocket = this._getws();
  
  static get styles() {
    return [
      SharedStyles,
      ButtonSharedStyles,
      css`
        button {
          border: 2px solid var(--app-dark-text-color);
          border-radius: 3px;
          padding: 8px 16px;
        }

        button:hover {
          border-color: var(--app-primary-color);
          color: var(--app-primary-color);
        }

        .cart,
        .cart svg {
          fill: var(--app-primary-color);
          width: 64px;
          height: 64px;
        }

        .circle.small {
          margin-top: -72px;
          width: 28px;
          height: 28px;
          font-size: 16px;
          font-weight: bold;
          line-height: 30px;
        }
      `
    ];
  }

  protected render() {
    return html`
      <section>
        <h2>State container example: shopping cart</h2>
        <div class="cart">${addToCartIcon}<div class="circle small">${this._numItemsInCart(this._cart)}</div></div>

        <p>This is a slightly more advanced example, that simulates a
          shopping cart: getting the products, adding/removing items to the
          cart, and a checkout action, that can sometimes randomly fail (to
          simulate where you would add failure handling). </p>
        <p>This view, passes properties down to its two children, <code>&lt;shop-products&gt;</code> and
        <code>&lt;shop-cart&gt;</code>, which fire events back up whenever
        they need to communicate changes.</p>
      </section>
      <section>
        <h3>Products</h3>
        <shop-products .products="${this.products}"></shop-products>

        <br>
        <h3>Your Cart</h3>
        <shop-cart .products="${this.products}" .cart="${this._cart}"></shop-cart>

        <div>${this._error}</div>
        <br>
        <p>
          <button ?hidden="${this._cart.addedIds.length == 0}"
              @click="${this.checkout}">
            Checkout
          </button>
        </p>
      </section>
    `;
  }

  constructor() {
    super();
    this.addEventListener('addToCart', ((e: CustomEvent) => 
      {this._addToCart(e.detail.item)}) as  EventListener);
    this.addEventListener('removeFromCart', ((e: CustomEvent) =>
      {this._removeFromCart(e.detail.item)}) as EventListener);
          //var wsOPPui = document.getElementsByTagName("opp-ui");
    let self = this;
    this.ws.onmessage = function (message) {
      self.products = JSON.parse(message.data);
    }
  }

  checkout() {
    this._error = '';
    this._cart = {addedIds: [], quantityById: []};
  }

  private _addToCart(productId: number) {
    this._error = '';
    if (this.products[productId].inventory > 0) {
      this.products[productId].inventory--;
      this.ws.send(JSON.stringify(this.products));
      if (this._cart.addedIds.indexOf(productId) !== -1) {
        this._cart.quantityById[productId]++;
      } else {
        this._cart.addedIds.push(productId);
        this._cart.quantityById[productId] = 1;
      }
    }

    // TODO: this should be this.invalidate
    this.products = JSON.parse(JSON.stringify(this.products));
    this._cart = JSON.parse(JSON.stringify(this._cart));
  }

  private _removeFromCart(productId: number) {
    this._error = '';
    this.products[productId].inventory++;

    const quantity = this._cart.quantityById[productId];
    if (quantity === 1) {
      this._cart.quantityById[productId] = 0;
      // This removes all items in this array equal to productId.
      this._cart.addedIds = this._cart.addedIds.filter(e => e !== productId);
    } else{
      this._cart.quantityById[productId]--;
    }

    // TODO: this should be this.invalidate
    this.products = JSON.parse(JSON.stringify(this.products));
    this._cart = JSON.parse(JSON.stringify(this._cart));
  }

  private _numItemsInCart(cart: Cart) {
    let num = 0;
    for (let id of cart.addedIds) {
      num += cart.quantityById[id];
    }
    return num;
  }

  private _getAllProducts() {
    // Here you would normally get the data from the server.
    const PRODUCT_LIST = [
      {"id": 1, "title": "Cabot Creamery Extra Sharp Cheddar Cheese", "price": 10.99, "inventory": 2},
      {"id": 2, "title": "Cowgirl Creamery Mt. Tam Cheese", "price": 29.99, "inventory": 10},
      {"id": 3, "title": "Tillamook Medium Cheddar Cheese", "price": 8.99, "inventory": 5},
      {"id": 4, "title": "Point Reyes Bay Blue Cheese", "price": 24.99, "inventory": 7},
      {"id": 5, "title": "Shepherd's Halloumi Cheese", "price": 11.99, "inventory": 3}
    ];
    // You could reformat the data in the right format as well:
    const products: Products = PRODUCT_LIST.reduce((obj: Products, product: Product) => {
      obj[product.id] = product
      return obj
    }, {});
    return products;
  }
  private _getws() {
    return new WebSocket ("ws://127.0.0.1:6789/")
  }
}
