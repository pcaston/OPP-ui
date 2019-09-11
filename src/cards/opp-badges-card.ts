import { html, property, customElement } from 'lit-element';

import "../components/entity/opp-state-label-badge";
import { OpenPeerPower } from '../types';
import { PageViewElement } from '../components/page-view-element';

@customElement("opp-badges-card")
export class OppBadgesCard extends PageViewElement {
  @property() private _opp?: OpenPeerPower;
  @property() public state?: Array;
  protected render() {
    return html`
      <style>
        opp-state-label-badge {
          display: inline-block;
          margin-bottom: var(--opp-state-label-badge-margin-bottom, 16px);
        }
      </style>

      ${Object.keys(this._opp!.states!).map((key) => {
        const item = this._opp!.states![key];
        return html`
          <div>
            <opp-state-label-badge _opp="${this._opp}" id="${item.entity_id}" state="${item}"></opp-state-label-badge>
          </div>
        `;
      })
    }
    `;
  }
  constructor() {
    super();
    debugger;
    console.log(this._opp);
  }
}