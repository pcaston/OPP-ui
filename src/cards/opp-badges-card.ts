import { html, property, customElement } from 'lit-element';

import "../components/entity/opp-state-label-badge";
import { OpenPeerPower } from '../types';
import { PageViewElement } from '../components/page-view-element';

@customElement("opp-badges-card")
export class OppBadgesCard extends PageViewElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states?: Array<String>;
  protected render() {
    debugger;
    return html`
      <style>
        opp-state-label-badge {
          display: inline-block;
          margin-bottom: var(--opp-state-label-badge-margin-bottom, 16px);
        }
      </style>

      ${Object.keys(this.opp!.states!).map((key) => {
        const item = this.opp!.states![key];
        return html`
          <div>
            <opp-state-label-badge opp="${this.opp}" id="${item.entity_id}" state="${item}"></opp-state-label-badge>
          </div>
        `;
      })
    }
    `;
  }
  constructor() {
    super();
    debugger;
    console.log(this.opp);
  }
  protected firstUpdated() {
    debugger;
    console.log(this.opp);
  }
}