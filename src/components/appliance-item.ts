/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, property, customElement } from 'lit-element';

@customElement('appliance-item')
export class ShopItem extends LitElement {
  @property({type: String}) id = '';

  @property({type: String}) name = '';

  @property({type: String}) type = '';

  @property({type: Number}) usage = 0;

  @property({type: String}) cost = '';

  protected render() {
    return html`
      id:
      ${this.id}
      name:
      ${this.name}
      type:
      ${this.type}
      <span ?hidden="${this.usage === 0}">usage:${this.usage} kwh </span>
      cost:
      $${this.cost}
      </span>
    `;
  }
}
