import { LitElement, html, property, customElement } from 'lit-element';

import "../components/entity/opp-state-label-badge";
import { OpenPeerPower } from '../types';
import { OppEntities, OppEntity} from "../open-peer-power-js-websocket/lib";

@customElement("opp-badges-card")
export class OppBadgesCard extends LitElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states?: OppEntities;

  protected render() {
    return html`
      <style>
        opp-state-label-badge {
          display: inline-block;
          margin-bottom: var(--opp-state-label-badge-margin-bottom, 16px);
        }
      </style>
      ${Object.keys(this.states!).map((key) => {
        const state: OppEntity = this.states![key];
        return html`
          <div>
            <opp-state-label-badge .opp="${this.opp}" id="${state.entity_id}" .state="${state}"></opp-state-label-badge>
          </div>
        `;
      })
    }
    `;
  }
}