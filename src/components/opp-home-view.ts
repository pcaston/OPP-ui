import { html, css, property, customElement } from 'lit-element';
//@ts-ignore
import { PageViewElement } from './page-view-element';
import { OppElement } from "../state/opp-element";

// These are the elements needed by this element.
import { OpenPeerPower, OppEntities} from "../types";
import '../cards/op-badges-card';


// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { ButtonSharedStyles } from './button-shared-styles';

@customElement('opp-home-view')
export class OppHomeView extends OppElement {

  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states!: OppEntities;
 
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
        <op-badges-card .opp="${this.opp}" .states="${this.states}"></op-badges-card>
      </section>
    `;
  }
}