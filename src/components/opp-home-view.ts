import { html, css, property, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';
import { OppElement } from "../state/opp-element";

// These are the elements needed by this element.
import { OpenPeerPower } from "../types";
import { OppEntities } from "../open-peer-power-js-websocket/lib";
import './appliance-list';
import '../cards/opp-badges-card';
import { Appliances } from './appliance-list';


// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { ButtonSharedStyles } from './button-shared-styles';

@customElement('opp-home-view')
export class OppHomeView extends OppElement {

  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states!: OppEntities;
  @property({ type : Array }) appliances: Appliances = {};
 
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
    this.states = this.opp.states!;
    return html`
      <section>
        <opp-badges-card .opp="${this.opp}" .states="${this.states}"></opp-badges-card>
      </section>
      <section>
        <h2>Discovered Appliances</h2>

        <p>This is a simulation of a list of appliances. </p>
        <p>This view, passes properties down to its child, <code>&lt;appliances&gt;</code>, which fires events back up whenever
        it needs to communicate changes.</p>
      </section>
      <section>
        <h3>Appliances</h3>
        <appliance-list .appliances="${this.appliances}"></appliance-list>
      </section>
    `;
  }
}