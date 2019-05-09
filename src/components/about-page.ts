/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('about-page')
export class AboutPage extends PageViewElement {
  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    return html`
      <section>
        <h2>Open Peer Power</h2>
        <p>This is an open source project to unite and empower prosumers.  Prosumers are traditional customers of the power utilities that can now
        produce and consume their own power.</p>
        <p>If you are a prosumer, OPP can enable you to know you power needs and capacities so you can buy, sell, use or store power, 
        to optimise the benefits from your power investments.
        </p> 
        <p>Return to the 
           <a href="/">home</a> page
        </p>
      </section>
    `
  }
}