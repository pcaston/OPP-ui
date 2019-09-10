import { html, css, property, customElement } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the elements needed by this element.
import { OpenPeerPower } from "../types";
import './badges-list';
import './appliance-list';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { ButtonSharedStyles } from './button-shared-styles';
import { Appliances } from './appliance-list';
import { Badges } from './badges-list';

@customElement('opp-home-view')
export class AppliancesView extends PageViewElement {

  @property() private opp!: OpenPeerPower;
  @property() private appliances: Appliances = {};
  @property() private badges: Badges = {};
 
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
        <h3>Badger</h3>
        <script>console.log("home-view")</script>
        <badge-list .opp="${this.opp}"></badge-list>
      </section>
      <section>
        <h2>Discovered Appliances</h2>

        <p>This is a simulation of a list of appliances.  
          The list of appliances is sourced from the server via a websocket.
          As changes are made to the appliances, the changes are sent back to the server via the websocket.
          The server then notifies all client via their respective websockets. </p>
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