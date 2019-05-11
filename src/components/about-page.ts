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