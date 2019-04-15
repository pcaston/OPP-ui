/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, property, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
// These are the elements needed by this element.
import './counter-element.js';
// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
let MyView2 = class MyView2 extends PageViewElement {
    constructor() {
        super();
        this._clicks = 0;
        this._value = 0;
        this._clicks = 0;
        this._value = 0;
    }
    static get styles() {
        return [
            SharedStyles
        ];
    }
    render() {
        return html `
      <section>
        <h2>State container example: simple counter</h2>
        <div class="circle">${this._clicks}</div>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code> which is connected to the
        store. When the element updates its counter, this page updates the values
        in the store, and you can see the total number of clicks reflected in
        the bubble above.</p>
        <br><br>
      </section>
      <section>
        <p>
          <counter-element
              value="${this._value}"
              clicks="${this._clicks}"
              @counter-incremented="${this._increment}"
              @counter-decremented="${this._decrement}">
          </counter-element>
        </p>
      </section>
    `;
    }
    _increment() {
        this._clicks++;
        this._value++;
    }
    _decrement() {
        this._clicks++;
        this._value--;
    }
};
__decorate([
    property({ type: Number })
], MyView2.prototype, "_clicks", void 0);
__decorate([
    property({ type: Number })
], MyView2.prototype, "_value", void 0);
MyView2 = __decorate([
    customElement('my-view2')
], MyView2);
export { MyView2 };
