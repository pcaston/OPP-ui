import {
  LitElement,
  html,
  customElement,
  property,
} from "lit-element";

import "../components/entity/opp-state-label-badge";
import { OpenPeerPower } from '../types';

@customElement("opp-badges-card")
export class OppBadgesCard extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public state?: Array;
  static get template() {
    return html`
      <style>
        opp-state-label-badge {
          display: inline-block;
          margin-bottom: var(--opp-state-label-badge-margin-bottom, 16px);
        }
      </style>
      <template is="dom-repeat" items="[[states]]">
        <opp-state-label-badge
          opp="[[opp]]"
          state="[[item]]"
        ></opp-state-label-badge>
      </template>
    `;
  }
}