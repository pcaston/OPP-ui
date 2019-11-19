import { LitElement, property, customElement } from 'lit-element';
import { OpenPeerPower, OppEntity } from '../types';

import "./state-card-climate";
import "./state-card-configurator";
import "./state-card-cover";
import "./state-card-display";
import "./state-card-input_number";
import "./state-card-input_select";
import "./state-card-input_text";
import "./state-card-lock";
import "./state-card-media_player";
import "./state-card-scene";
import "./state-card-script";
import "./state-card-timer";
import "./state-card-toggle";
import "./state-card-vacuum";
import "./state-card-water_heater";
import "./state-card-weblink";

import stateCardType from "../common/entity/state_card_type";
import dynamicContentUpdater from "../common/dom/dynamic_content_updater";

@customElement("state-card-content")
// @ts-ignore
class StateCardContent extends LitElement {
  @property({type: Object})
  private opp: OpenPeerPower = {};
  @property({type: Object})
  private stateObj!: OppEntity;
  @property({type: Boolean})
  private inDialog = false;

  update(changedProperties) {
    super.update(changedProperties);
    debugger;
    if (changedProperties.has('opp') || changedProperties.has('stateObj')) {
      let stateCard : String;
      if (this.stateObj.attributes && "custom_ui_state_card" in this.stateObj.attributes) {
        stateCard = this.stateObj.attributes.custom_ui_state_card;
      } else {
        stateCard = "state-card-" + stateCardType(this.opp, this.stateObj);
      }
      dynamicContentUpdater(this, stateCard.toUpperCase(), {
        opp: this.opp,
        stateObj: this.stateObj,
        inDialog: this.inDialog,
      });
    }
  };
}
