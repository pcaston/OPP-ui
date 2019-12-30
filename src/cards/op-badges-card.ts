import { LitElement, html, property, customElement } from 'lit-element';

import "../components/entity/op-state-label-badge";
import { OpenPeerPower } from '../types';
import { OppEntities, OppEntity} from "../types";

@customElement("op-badges-card")
export class OppBadgesCard extends LitElement {
  @property({ type : Object }) opp!: OpenPeerPower;
  @property({ type : Array }) states?: OppEntities;

  protected render() {
    return html`
      <style>
        op-state-label-badge {
          display: inline-block;
          margin-bottom: var(--op-state-label-badge-margin-bottom, 16px);
        }
      </style>
      ${Object.keys(this.states!).map((key) => {
        const state: OppEntity = this.states![key];
        return html`
          <div>
            <op-state-label-badge .opp="${this.opp}" id="${state.entity_id}" .state="${state}"></op-state-label-badge>
          </div>
        `;
      })
    }
    `;
  }
}