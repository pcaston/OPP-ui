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
import './device-list';
import './shop-cart';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { ButtonSharedStyles } from './button-shared-styles';
import { addToCartIcon } from './my-icons';
import { Devices } from './device-list';
import { Cart } from './shop-cart';

@customElement('opp-devices-view')
export class DevicesView extends PageViewElement {

  @property({type: Object})
  private _cart: Cart = { addedIds: [], quantityById: [] }

  @property({type: String})
  private _error = '';

  @property({type: Object})
  private devices: Devices = {};

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
        <h2>Discovered Devices</h2>
        <div class="cart">${addToCartIcon}<div class="circle small">${this._numItemsInCart(this._cart)}</div></div>

        <p>This is a simulation of a list of devices.  
          The list of devices is sourced from the server via a websocket.
          As changes are made to the devices, the changes are sent back to the server via the websocket.
          The server then notifies all client via their respective websockets. </p>
        <p>This view, passes properties down to its two children, <code>&lt;devices&gt;</code> and
        <code>&lt;appliances&gt;</code>, which fire events back up whenever
        they need to communicate changes.</p>
      </section>
      <section>
        <h3>Devices</h3>
        <device-list .devices="${this.devices}"></device-list>

        <br>
        <h3>Appliances</h3>
        <shop-cart .devices="${this.devices}" .cart="${this._cart}"></shop-cart>

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
      self.devices = JSON.parse(message.data);
    }
  }

  checkout() {
    this._error = '';
    this._cart = {addedIds: [], quantityById: []};
  }

  private _addToCart(deviceId: number) {
    this._error = '';
    if (this.devices[deviceId].power > 0) {
      let prods: Devices = this.devices;
      //this.devices[deviceId].power--;
      prods[deviceId].power--;
      this.ws.send(JSON.stringify(prods));
      if (this._cart.addedIds.indexOf(deviceId) !== -1) {
        this._cart.quantityById[deviceId]++;
      } else {
        this._cart.addedIds.push(deviceId);
        this._cart.quantityById[deviceId] = 1;
      }
    }

    // TODO: this should be this.invalidate
    this.devices = JSON.parse(JSON.stringify(this.devices));
    this._cart = JSON.parse(JSON.stringify(this._cart));
  }

  private _removeFromCart(deviceId: number) {
    this._error = '';
    this.devices[deviceId].power++;

    const quantity = this._cart.quantityById[deviceId];
    if (quantity === 1) {
      this._cart.quantityById[deviceId] = 0;
      // This removes all items in this array equal to deviceId.
      this._cart.addedIds = this._cart.addedIds.filter(e => e !== deviceId);
    } else{
      this._cart.quantityById[deviceId]--;
    }

    // TODO: this should be this.invalidate
    this.devices = JSON.parse(JSON.stringify(this.devices));
    this._cart = JSON.parse(JSON.stringify(this._cart));
  }

  private _numItemsInCart(cart: Cart) {
    let num = 0;
    for (let id of cart.addedIds) {
      num += cart.quantityById[id];
    }
    return num;
  }

  private _getws() {
    return new WebSocket ("ws://127.0.0.1:6789/")
  }
}
