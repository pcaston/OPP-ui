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

  @property({type: Object})
  private opp: OpenPeerPower = {};

  @property({type: Object})
  private appliances: Appliances = {};

  @property({type: Object})
  private badges: Badges = {};

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

  constructor() {
    super();
    this.addEventListener('reduceUsage', ((e: CustomEvent) => 
      {this._reduceUsage(e.detail.item)}) as  EventListener);
    let self = this;
    this.ws.onmessage = function (message) {
      self.appliances = JSON.parse(message.data);
      console.log(message.data);
    }
  }

  private _reduceUsage(applianceId: string) {
    if (this.appliances[applianceId].usage.value > 0) {
      let appls: Appliances = this.appliances;
      //this.appliances[applianceId].usage--;
      appls[applianceId].usage.value--;
      this.ws.send(JSON.stringify(appls));
    }

    this.appliances = JSON.parse(JSON.stringify(this.appliances));
  }

  private _getws() {
    return new WebSocket ("ws://127.0.0.1:8123/api/websocket")
  }
}
