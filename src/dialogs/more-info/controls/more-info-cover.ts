import "@polymer/iron-flex-layout/iron-flex-layout-classes";
import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-cover-tilt-controls";
import "../../../components/op-labeled-slider";
import CoverEntity from "../../../util/cover-model";

import attributeClassNames from "../../../common/entity/attribute_class_names";
import featureClassNames from "../../../common/entity/feature_class_names";

const FEATURE_CLASS_NAMES = {
  128: "has-set_tilt_position",
};
class MoreInfoCover extends PolymerElement {
  static get template() {
    return html`
      <style include="iron-flex"></style>
      <style>
        .current_position,
        .tilt {
          max-height: 0px;
          overflow: hidden;
        }

        .has-current_position .current_position,
        .has-set_tilt_position .tilt,
        .has-current_tilt_position .tilt {
          max-height: 208px;
        }

        [invisible] {
          visibility: hidden !important;
        }
      </style>
      <div class$="[[computeClassNames(stateObj)]]">
        <div class="current_position">
          <op-labeled-slider
            caption="[['ui.card.cover.position']]"
            pin=""
            value="{{coverPositionSliderValue}}"
            disabled="[[!entityObj.supportsSetPosition]]"
            on-change="coverPositionSliderChanged"
          ></op-labeled-slider>
        </div>

        <div class="tilt">
          <op-labeled-slider
            caption="[['ui.card.cover.tilt_position']]"
            pin=""
            extra=""
            value="{{coverTiltPositionSliderValue}}"
            disabled="[[!entityObj.supportsSetTiltPosition]]"
            on-change="coverTiltPositionSliderChanged"
          >
            <op-cover-tilt-controls
              slot="extra"
              hidden$="[[entityObj.isTiltOnly]]"
              opp="[[opp]]"
              state-obj="[[stateObj]]"
            ></op-cover-tilt-controls>
          </op-labeled-slider>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      stateObj: {
        type: Object,
        observer: "stateObjChanged",
      },
      entityObj: {
        type: Object,
        computed: "computeEntityObj(opp, stateObj)",
      },
      coverPositionSliderValue: Number,
      coverTiltPositionSliderValue: Number,
    };
  }

  computeEntityObj(opp, stateObj) {
    return new CoverEntity(opp, stateObj);
  }

  stateObjChanged(newVal) {
    if (newVal) {
      this.setProperties({
        coverPositionSliderValue: newVal.attributes.current_position,
        coverTiltPositionSliderValue: newVal.attributes.current_tilt_position,
      });
    }
  }

  computeClassNames(stateObj) {
    var classes = [
      attributeClassNames(stateObj, [
        "current_position",
        "current_tilt_position",
      ]),
      featureClassNames(stateObj, FEATURE_CLASS_NAMES),
    ];
    return classes.join(" ");
  }

  coverPositionSliderChanged(ev) {
    this.entityObj.setCoverPosition(ev.target.value);
  }

  coverTiltPositionSliderChanged(ev) {
    this.entityObj.setCoverTiltPosition(ev.target.value);
  }
}

customElements.define("more-info-cover", MoreInfoCover);
