import { h, Component } from "preact";

import "@polymer/paper-input/paper-input";
import "../../../../components/entity/op-entity-picker";

import { onChangeEvent } from "../../../../common/preact/event";

export default class StateTrigger extends Component {
  constructor() {
    super();

    this.onChange = onChangeEvent.bind(this, "trigger");
    this.entityPicked = this.entityPicked.bind(this);
  }

  entityPicked(ev) {
    this.props.onChange(
      this.props.index,
      Object.assign({}, this.props.trigger, { entity_id: ev.target.value })
    );
  }

  /* eslint-disable camelcase */
  render({ trigger, opp }) {
    const { entity_id, to } = trigger;
    const trgFrom = trigger.from;
    let trgFor = trigger.for;

    if (trgFor && (trgFor.hours || trgFor.minutes || trgFor.seconds)) {
      // If the trigger was defined using the yaml dict syntax, convert it to
      // the equivalent string format
      let { hours = 0, minutes = 0, seconds = 0 } = trgFor;
      hours = hours.toString();
      minutes = minutes.toString().padStart(2, "0");
      seconds = seconds.toString().padStart(2, "0");

      trgFor = `${hours}:${minutes}:${seconds}`;
    }
    return (
      <div>
        <op-entity-picker
          value={entity_id}
          onChange={this.entityPicked}
          opp={opp}
          allowCustomEntity
        />
        <paper-input
          label={
            "ui.panel.config.automation.editor.triggers.type.state.from"
          }
          name="from"
          value={trgFrom}
          onvalue-changed={this.onChange}
        />
        <paper-input
          label={
            "ui.panel.config.automation.editor.triggers.type.state.to"
          }
          name="to"
          value={to}
          onvalue-changed={this.onChange}
        />
        <paper-input
          label={
            "ui.panel.config.automation.editor.triggers.type.state.for"
          }
          name="for"
          value={trgFor}
          onvalue-changed={this.onChange}
        />
      </div>
    );
  }
}

StateTrigger.defaultConfig = {
  entity_id: "",
};
