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
import './appliance-item';

// These are the elements needed by this element.
import { addToCartIcon } from './my-icons';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';

export interface Appliances {
  [index:string]: Appliance;
}
export interface Appliance {
  appliance: {id: string; name: string; type: string};
  usage: {value: number; unit: string};
  cost: {currency: string; value: number};
}

@customElement('appliance-list')
export class ShopAppliances extends LitElement {

  @property({type: Object})
  private appliances: Appliances = {};

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
      ${Object.keys(this.appliances).map((key) => {
        const item = this.appliances[key];
        return html`
          <div>
            <appliance-item id="${item.appliance.id}" name="${item.appliance.name}" type="${item.appliance.type}" 
                usage="${item.usage.value}" cost="${item.cost.value}"></appliance-item>
            <button
                .disabled="${item.usage.value === 0}"
                @click="${this._reduceUsage}"
                data-index="${item.appliance.id}"
                name="${item.usage.value === 0 ? 'Not used' : 'Reduce Usage' }">
              ${item.usage.value === 0 ? 'Not used': addToCartIcon }
            </button>
          </div>
        `;
      })}
    `;
  }
  
  private _reduceUsage(event: { currentTarget: { dataset: { [x: string]: any; }; }; }) {
    this.dispatchEvent(new CustomEvent("reduceUsage",
        {bubbles: true, composed: true, detail:{item:event.currentTarget.dataset['index']}}));
  }
}